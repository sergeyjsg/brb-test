/**
 * Users REST API service
 */

import { Op, Sequelize } from 'sequelize';
import { userMessage } from '../messages/users';
import AgentListing from '../models/AgentListing';
import User from '../models/User';
import * as helpers from '../utils/helpers';
import jwt from '../utils/jwt';

import ClientError from '../classes/errors/ClientError';
import { AnonymousActionParams } from '../definitions';


class Service {

    public async signIn ({ ctx, body }: AnonymousActionParams): Promise<void> {
        const user = await User.findByPk(body.userId);
        if (!user) throw new ClientError(`User not found`, 404);

        const token: string = await jwt.generateTokenForClaim({ userId: user.id });

        return ctx.returnJson({
            data: {
                user: userMessage(user),
                token
            }
        });
    }


    public async signUp ({ ctx, body }: AnonymousActionParams): Promise<void> {
        const user = await User.create({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            role: body.role
        });

        return ctx.returnJson({ data: { user: userMessage(user) }}, 201);
    }


    public async list ({ ctx, params }: AnonymousActionParams): Promise<void> {
        const { offset, limit } = helpers.getOffsetLimit(params);

        const items = await User.findAll({ offset, limit, order: [['id', 'asc']] });
        const total = await User.count();

        return ctx.returnJson({ data: { users: items.map(userMessage) }, meta: { offset, limit, total } });
    }


    /**
     * Analytical function
     * Returns list of users with a number of listings for each user
     * @param ctx
     * @param params
     */

    public async counts ({ ctx, params }: AnonymousActionParams): Promise<void> {
        const { offset, limit } = helpers.getOffsetLimit(params);

        const items = await User.findAll({ offset, limit, order: [['id', 'asc']] });
        const total = await User.count();

        // Fetch counts
        const counts = await AgentListing.findAll({
            attributes: [
                'agentId',
                [Sequelize.fn('COUNT', Sequelize.col('listingId')), 'cnt']
            ],
            where: {
                agentId: {
                    [Op.in]: items.map(item => item.id)
                }
            },
            group: 'agentId'
        });
        const indexedCounts = helpers.index(counts.map(row => ({ agentId: row.agentId, count: (row as any).dataValues['cnt'] })), 'agentId');

        return ctx.returnJson({
            data: {
                userListingCounts: items.map(agent => ({
                    id: agent.id,
                    name: agent.firstName + ' ' + agent.lastName,
                    listings: indexedCounts[agent.id] ? (indexedCounts[agent.id] as any).count : 0
                }))
            },
            meta: {
                offset,
                limit,
                total
            }
        });
    }

}


export default new Service();
