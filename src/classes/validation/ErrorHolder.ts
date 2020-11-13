
import { ExtendedContext, FieldError } from '../../definitions';


export default class ErrorHolder {

    public errors: FieldError[];

    constructor () {
        this.errors = [];
    }

    public push (field: string, error: string): void {
        this.errors.push({ field, error });
        return;
    }

    public print (ctx: ExtendedContext): void {
        ctx.body = {
            error: {
                message: 'Invalid input',
                errors: this.errors
            }
        };
        ctx.status = 400;
    }


    public message (): string {
        return `Invalid input. ${this.errors.length} error(s): ` + JSON.stringify(this.errors);
    }


    public throw (ctx: ExtendedContext): void {
        ctx.body = {
            error: {
                message: 'Invalid input',
                errors: this.errors
            }
        };
        ctx.status = 400;

    }
}
