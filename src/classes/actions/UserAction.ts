
import * as joi from 'joi';
import logger from '../../providers/Logger';
import config from '../../providers/Config';

import { ExtendedContext, UserAction } from '../../definitions';
import { UserClaim } from '../../definitions';
import jwt from '../../utils/jwt';
import User  from '../../models/User';
import CommonValidator from '../validation/CommonValidator';


export default function (callback: UserAction, bodySchema?: joi.Schema): any {
    return async (ctx: ExtendedContext): Promise<void> => {
        let tokenHeader: string;
        if (Array.isArray(ctx.req.headers.authorization)) tokenHeader = (ctx.req.headers.authorization as any)[0];
        else tokenHeader = ctx.req.headers.authorization as any;

        if (!tokenHeader) return ctx.returnError('You are not authenticated! Please provide API token.', 401);

        const claim: UserClaim = await jwt.validateAndExtractClaim(config.secret, tokenHeader);
        const params = Object.assign({}, ctx.request.query, ctx.params);
        const body = ctx.request.body;

        const user = await User.findByPk(claim.userId);
        if (!user) return ctx.returnError('User not found!', 401);

        if (bodySchema) {
            const validator = new CommonValidator();
            await validator.validate(body, bodySchema, { abortEarly: false });
            if (validator.invalid()) {
                return validator.print(ctx);
            }
        }

        logger.debug('info', `HTTP request to ${ctx._matchedRoute} by user ${user.id}`);
        return await callback({ ctx, params, body, user });
    };
}
