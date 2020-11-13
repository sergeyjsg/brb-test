/**
 * Listings REST API service
 */

import { Op } from 'sequelize';
import { listingMessage } from '../messages/listings';
import Listing from '../models/Listing';
import AgentListing from '../models/AgentListing';
import listingManager from '../classes/ListingManager';
import * as helpers from '../utils/helpers';
import DB from '../providers/DB';

import ClientError from '../classes/errors/ClientError';
import { AnonymousActionParams, UserActionParams } from '../definitions';


class Service {

    public async list ({ ctx, params, user }: UserActionParams): Promise<void> {
        const { offset, limit } = helpers.getOffsetLimit(params);

        // Check permissions
        if (!helpers.isAdmin(user) && +params.userId !== user.id) {
            throw new ClientError(`Only listing owner or admin can access listings`);
        }

        const agentListings = await AgentListing.findAll({
            where: {
                agentId: user.id
            },
            order: [['listingId', 'asc']],
            offset,
            limit
        });
        const total = await AgentListing.count({ where: { agentId: user.id } });

        const listingIds = agentListings.map(item => item.listingId);
        const items = await Listing.findAll({ where: { id: { [Op.in]: listingIds }}});

        const listingAgentsInfo = await listingManager.fetchListingAgentsInfo(items);

        return ctx.returnJson({
            data: {
                listings: items.map(item => listingMessage(
                    item,
                    listingAgentsInfo.indexedListingAgents,
                    listingAgentsInfo.indexedUsers
                ))
            },
            meta: {
                offset,
                limit,
                total
            }
        });
    }


    public async item ({ ctx, params, user }: UserActionParams): Promise<void> {
        const item = await Listing.findByPk(params.listingId);
        if (!item) throw new ClientError(`Listing ${params.listingId} not found`, 404);

        // Validate permissions
        const validation = await listingManager.validatePermissions(item, user);
        if (!validation) throw new ClientError(`You do not have permission to update this listing`, 400);

        const listingAgentsInfo = await listingManager.fetchListingAgentsInfo([item]);

        return ctx.returnJson({
            data: {
                listing: listingMessage(item, listingAgentsInfo.indexedListingAgents, listingAgentsInfo.indexedUsers)
            }
        });
    }


    public async create ({ ctx, body, user }: UserActionParams): Promise<void> {
        // Check Role
        if (user.role !== 'AGENT') throw new ClientError(`Only Agents can create listings`);

        // Update 2 tables within a single transaction
        const transaction = await DB.transaction();
        const listing = await Listing.create({
            address: body.address
        }, { transaction });
        await AgentListing.create({
            agentId: user.id,
            listingId: listing.id
        }, { transaction })
        await transaction.commit();

        // Build return message for convenience
        const item = await Listing.findByPk(listing.id);
        if (!item) throw new ClientError(`Listing ${listing.id} not found`, 404);
        const listingAgentsInfo = await listingManager.fetchListingAgentsInfo([item]);

        // Return result
        return ctx.returnJson({
            data: {
                listing: listingMessage(listing, listingAgentsInfo.indexedListingAgents, listingAgentsInfo.indexedUsers)
            }
        }, 201);
    }


    public async update ({ ctx, params, body, user }: UserActionParams): Promise<void> {
        const existingListing = await Listing.findByPk(params.listingId);
        if (!existingListing) throw new ClientError(`Listing ${params.listingId} not found`, 404);

        // Validate permissions
        const validation = await listingManager.validatePermissions(existingListing, user);
        if (!validation) throw new ClientError(`You do not have permission to update this listing`, 400);

        // Update
        const updatedListing = await existingListing.update({ address: body.address });

        // Build return message for convenience
        const item = await Listing.findByPk(updatedListing.id);
        if (!item) throw new ClientError(`Listing ${updatedListing.id} not found`, 404);
        const listingAgentsInfo = await listingManager.fetchListingAgentsInfo([item]);

        // Return result
        return ctx.returnJson({
            data: {
                listing: listingMessage(updatedListing, listingAgentsInfo.indexedListingAgents, listingAgentsInfo.indexedUsers)
            }
        });
    }


    public async remove ({ ctx, params, user }: UserActionParams): Promise<void> {
        const existingListing = await Listing.findByPk(params.listingId);
        if (!existingListing) throw new ClientError(`Listing ${params.listingId} not found`, 404);

        // Validate permissions
        const validation = await listingManager.validatePermissions(existingListing, user);
        if (!validation) throw new Error(`You do not have permission to update this listing`);

        // Update 2 tables within a single transaction
        const transaction = await DB.transaction();
        await AgentListing.destroy({ where: { listingId: existingListing.id }, transaction });
        await existingListing.destroy({ transaction });
        await transaction.commit();

        return ctx.returnCode(204);
    }

}


export default new Service();
