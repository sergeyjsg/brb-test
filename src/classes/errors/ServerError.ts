
import ExtendableError from './ExtendableError';


export default class ServerError extends ExtendableError {

    constructor (message: string, code: number = 500) {
        super(message);
        this.code = code;
    }

}

