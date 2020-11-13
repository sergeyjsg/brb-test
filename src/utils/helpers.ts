
import User from '../models/User';


export interface OffsetLimit {
    offset: number;
    limit: number;
}


export function getOffsetLimit (params: any, defaultLimit: number = 10): OffsetLimit {
    if (!params) return { offset: 0, limit: 0 };
    const offset = isInt(params.offset) ? +params.offset : 0;
    const limit = isInt(params.limit) ? +params.limit : defaultLimit;
    return { offset, limit };
}


export function isAdmin (user: User): boolean {
    return user.role === 'ADMIN';
}


export function group <T> (arr: T[], prop: keyof T | 'id' = 'id'): { [key: string]: T[] } {
    let res: any = {};
    arr.forEach((el: any) => {
        if (!res[`${el[prop]}`]) res[`${el[prop]}`] = [];
        res[`${el[prop]}`].push(el);
    });
    return res;
}

export function index <T> (arr: T[], prop: keyof T | 'id' = 'id'): { [key: string]: T } {
    let res: any = {};
    arr.forEach((el: any) => res[`${el[prop]}`] = el);
    return res;
}


export function isInt (n: any): boolean {
    if (typeof n === 'undefined') return false;
    if (n === '' || n === null) return false;
    if (isNaN(n)) return false;
    return n % 1 === 0;
}
