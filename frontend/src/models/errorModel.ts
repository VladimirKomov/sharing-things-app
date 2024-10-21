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
        console.error(`Error ${this._code}: ${this._message}`);
        if (this._details) {
            console.error("Details:", this._details);
        }
    }

    toString(): string {
        return `Error ${this._code}: ${this._message}`;
    }

}