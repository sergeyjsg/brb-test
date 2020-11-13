
export default class ExtendableError extends Error {

    public code: number;
    public json: any | undefined;

    constructor (message: string, json?: any) {
        if (json) super(json.englishMessage || message);
        else super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
        this.json = { error: { message, details: json } };
        this.code = 500;
    }

}
