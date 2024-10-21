import axios, {AxiosResponse} from "axios";
import {RequestConfig} from "./requestModel.ts";
import {BaseError} from "./errorModel.ts";

export class BaseAPI {
    async request<T>(config: RequestConfig): Promise<AxiosResponse<T>> {
        try {
            const response: AxiosResponse<T> = await axios({
                method: config.method,
                url: config.url,
                ...(config.data && {data: config.data}),
                ...(config.headers && {headers: config.headers}),
            });
            return response;
        } catch (error: any) {
            if (error.response) {
                console.log(error.response.data.error);
                throw new BaseError(
                    error.response.data.error.message,
                    error.response.data.error.code,
                    error.response.data.error.details);
            } else {
                throw new BaseError('Network error or request failed', 500);
            }
        }
    }
}

export default BaseAPI;
