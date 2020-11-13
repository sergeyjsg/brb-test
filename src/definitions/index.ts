
import * as Router from 'koa-router';
import User  from '../models/User';


export interface AppConfig {
    name: string;
    host: string;
    port: number;
}

export interface LoggerConfig {
    level?: string;
}

export interface FullConfig {
    app: AppConfig;
    logger: LoggerConfig;
    secret: string;
}


export interface UserClaim {
    userId: number;
}


export interface ExtendedContext extends Router.IRouterContext {
    returnCode: (code: number) => void;
    returnError: (message: string, code?: number | undefined) => void;
    returnJson: (body: any, code?: number) => void;
}

export interface UserActionParams <Params extends any = any, Body extends any = any> {
    ctx: ExtendedContext;
    params: Params;
    body: Body;
    user: User;
}

export interface AnonymousActionParams <Params extends any = any, Body extends any = any> {
    ctx: ExtendedContext;
    params: Params;
    body: Body;
}

export interface FieldError {
    field: string;
    error: string;
}


export type AnonymousAction = (params: AnonymousActionParams) => Promise<void>;
export type UserAction = (params: UserActionParams) => Promise<void>;


