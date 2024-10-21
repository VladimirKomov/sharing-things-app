import {Logger} from "./Logger.ts";

export interface Error {
    message: string;
    code: number;
    details?: any;
}

export class BaseError implements Error {
    private _message: string;
    private _code: number;
    private _details?: any;

    constructor(message: string, code: number, details?: any) {
        this._message = message;
        this._code = code;
        this._details = details;

        //error logg
        this.logError();
    }

    get message(): string {
        return this._message;
    }

    get code(): number {
        return this._code;
    }

    get details(): any {
        return this._details;
    }

    private logError(): void {
        Logger.logError(JSON.stringify(this));
    }

}