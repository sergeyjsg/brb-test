
import * as joi from 'joi';
import { ExtendedContext } from '../../definitions';
import ErrorHolder from './ErrorHolder';


export default class CommonValidator {

    public errorHolder: ErrorHolder;


    constructor () {
        this.errorHolder = new ErrorHolder();
    }


    public async validate (value: any, schema: joi.Schema, options?: joi.ValidationOptions): Promise<joi.ValidationResult> {
        const self = this;
        const res: joi.ValidationResult = schema.validate(value, options);
        if (res.error && res.error.details) {
            res.error.details.forEach((detail) => self.errorHolder.push(detail.path.join(' - '), detail.message));
        }
        return res;
    }


    public invalid () {
        return this.errorHolder.errors.length > 0;
    }


    public print (ctx: ExtendedContext): void {
        return this.errorHolder.print(ctx);
    }

}
