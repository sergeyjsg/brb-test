
import ExtendableError from './ExtendableError';


export default class ClientError extends ExtendableError {

    constructor (message: string, code: number = 400) {
        super(message);
        this.code = code;
    }

}

