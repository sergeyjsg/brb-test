/**
 * Standard Koa Server class
 *
 * Several standard middleware used: router, helmet, json, convert, response time, cors
 */

import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as json from 'koa-json';
import * as convert from 'koa-convert';
import * as bodyParser from 'koa-bodyparser';
import * as cors from 'koa-cors';
import * as helmet from 'koa-helmet';
import * as responseTime from 'koa-response-time';
import * as net from 'net';

import { ExtendedContext } from '../definitions';
import { AppConfig } from '../definitions';


export default class Server {

    public readonly koa: Koa;
    public readonly router: Router;
    public readonly config: AppConfig;
    public server: net.Server | undefined;


    constructor (router: Router, config: AppConfig) {
        this.koa = new Koa();
        this.router = router;
        this.config = config;
        this.server = undefined;
    }


    public start (): Koa {
        const self = this;
        self.koa.use(responseTime());
        self.koa.use(convert(cors()));
        self.koa.use(helmet());
        self.koa.use(bodyParser({
            enableTypes: ['form', 'json', 'text'],
            formLimit: '24mb',
            jsonLimit: '24mb',
            textLimit: '24mb',
            extendTypes: {
                text: ['text/plain', 'text/csv']
            },
            onerror: (err: any, ctx: any) => {
                ctx.throw(JSON.stringify({ error: { message: 'Body parsing error. Invalid JSON.' } }, null, 2), 400);
            }
        }));
        self.koa.use(convert(json()));

        self.koa.use(self.injectJsonMethods.bind(self));
        self.koa.use(self.catchServerErrors.bind(self));

        self.koa.use(self.router.routes()).use(self.router.allowedMethods());

        self.server = self.koa.listen(self.config.port, self.config.host);
        console.info(`${self.config.name} http server started at ${self.config.host}:${self.config.port}`);
        return self.koa;
    }


    private async injectJsonMethods (ctx: ExtendedContext, next: any): Promise<void> {
        ctx.returnCode = (code: number): void => {
            ctx.status = code || 204;
        };

        ctx.returnError = (message: string, code?: number): void => {
            ctx.status = code || 400;
            ctx.body = { error: { message } };
        };

        ctx.returnJson = (body: any, code?: number): void => {
            ctx.status = code || 200;
            ctx.body = body;
        };

        return next();
    }


    private async catchServerErrors (ctx: ExtendedContext, next: any): Promise<void> {
        try {
            await next();
        } catch (err) {
            if (err.json !== undefined) ctx.returnJson(err.json, err.code || 500);
            else ctx.returnError(err.message, err.code || 500);
            console.error(err);
        }
    }

}
