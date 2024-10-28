import {Method} from 'axios';
import {API_BASE_URL} from "../../config.ts";
import {Logger} from "../logger.ts";

export interface RequestConfig {
    method: Method;
    url: string;
    params?: Record<string, string>;
    headers?: Record<string, string>;
    data?: any;
}

export class BaseRequest implements RequestConfig {
    private _method: Method;
    private _url: string;
    private _params?: Record<string, string>;
    private _data?: any;
    private _headers?: Record<string, string>;

    constructor({
                    method,
                    url,
                    params = {},
                    headers = {},
                    data = null,
                }: RequestConfig) {
        this._method = method;
        this._url = API_BASE_URL + url;
        this._params = params;
        this._data = data;
        this._headers = headers;

        this.log();
    }

    get method(): Method {
        return this._method;
    }

    get url(): string {
        return this._url;
    }

    get data(): any {
        return this._data;
    }

    get headers(): Record<string, string> | undefined {
        return this._headers;
    }

    get params(): Record<string, string> | undefined {
        return this._params;
    }

    private log(): void {
        Logger.logResponse(JSON.stringify(this));
    }
}