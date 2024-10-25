import { Method } from 'axios';
import {API_BASE_URL} from "../../config.ts";

export interface RequestConfig {
    method: Method;
    url: string;
    data?: any;
    headers?: Record<string, string>;
}

export class BaseRequest implements RequestConfig {
    private _method: Method;
    private _url: string;
    private _data?: any;
    private _headers?: Record<string, string>;

    constructor(method: Method, url: string, data?: any, headers?: Record<string, string>) {
        this._method = method;
        this._url = API_BASE_URL + url;
        this._data = data;
        this._headers = headers || {};  // Если заголовки не переданы, используем пустой объект
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

    get headers(): Record<string, string> {
        return this._headers || {};
    }
}