import {Logger} from "../logger.ts";

export interface Response<T> {
    data: T;
    message: string;
    code: number;
}

export class BaseResponse<T> implements Response<T> {
    private _data: T;
    private _message: string;
    private _code: number;

    constructor(data: T, message: string = "Success", code: number = 200) {
        this._data = data;
        this._message = message;
        this._code = code;

        this.log();
    }

    get data(): T {
        return this._data;
    }

    get message(): string {
        return this._message;
    }

    get code(): number {
        return this._code;
    }

    private log(): void {
        Logger.logResponse(JSON.stringify(this));
    }
}
