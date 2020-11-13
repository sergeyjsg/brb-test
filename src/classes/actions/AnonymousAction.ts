
import { AnonymousAction, ExtendedContext } from '../../definitions';
import * as joi from 'joi';

import logger from '../../providers/Logger';
import CommonValidator from '../validation/CommonValidator';


export default function (callback: AnonymousAction, bodySchema?: joi.Schema): any {
    return async (ctx: ExtendedContext): Promise<void> => {
        let params = Object.assign({}, ctx.request.query, ctx.params);
        const body = ctx.request.body;

        logger.debug('info', `HTTP request to endpoint ${ctx.path} from anonymous`);

        if (bodySchema) {
            const validator = new CommonValidator();
            await validator.validate(body, bodySchema, { abortEarly: false });
            if (validator.invalid()) {
                return validator.print(ctx);
            }
        }

        return await callback({ ctx, params, body });
    };
}
