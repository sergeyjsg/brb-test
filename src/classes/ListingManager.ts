/**
 * Business logic module, related to Listings service and data model
 */

import { Op } from 'sequelize';
import AgentListing from '../models/AgentListing';
import Listing from '../models/Listing';
import User from '../models/User';
import * as helpers from '../utils/helpers';


export class ListingManager {

    /**
     * Fetches additional information for listings, while avoiding JOINs
     * O(N) type complexity achieved by using Hash Maps
     * @param listings
     */

    public async fetchListingAgentsInfo (listings: Listing[]) {
        const listingIds = listings.map(listing => listing.id);
        const listingAgents = await AgentListing.findAll({
            where: {
                listingId: {
                    [Op.in]: listingIds
                }
            }
        });
        const userIds = listingAgents.map(ref => ref.agentId);
        const users = await User.findAll({
            where: {
                id: {
                    [Op.in]: userIds
                }
            }
        })
        const indexedListingAgents = helpers.group(listingAgents, 'listingId');
        const indexedUsers = helpers.index(users, 'id');

        return { indexedListingAgents, indexedUsers };
    }


    /**
     * Checks if a user is an Admin or an owner of a listing
     * @param listing
     * @param agent
     */

    public async validatePermissions (listing: Listing, agent: User) {
        const agentListings = await AgentListing.findAll({ where: { listingId: listing.id } });
        return !(!helpers.isAdmin(agent) && !agentListings.map(listing => listing.agentId).includes(agent.id));
    }

}

export default new ListingManager();
