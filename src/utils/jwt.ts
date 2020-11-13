
import * as jwtLib from 'jsonwebtoken';
import config from '../providers/Config';
import { UserClaim } from '../definitions';


export class JWT {

    public async generateTokenForClaim (claim: any): Promise<string> {
        return new Promise((resolve: (str: any) => any, reject: (err: any) => any) => {
            jwtLib.sign(
                claim,
                config.secret,
                { algorithm: 'HS256' },
                (err: Error | null, encoded?: string): jwtLib.SignCallback => {
                    if (err) return reject(err);
                    return resolve(encoded);
            });
        });
    }


    public async validateAndExtractClaim (secret: string, token: string): Promise<UserClaim> {
        token = token.replace('Bearer ', '');
        return new Promise((resolve: (res: any) => any, reject: (err: any) => any) => {
            jwtLib.verify(
                token,
                secret,
                { algorithms: ['HS256'] },
                (err: jwtLib.VerifyErrors | null, decoded?: object): jwtLib.VerifyCallback => {
                    if (err) return reject(err);
                    return resolve(decoded);
            });
        });
    }

}

export default new JWT();
