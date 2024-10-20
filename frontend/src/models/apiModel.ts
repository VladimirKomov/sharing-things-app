import axios, {AxiosResponse} from "axios";
import {IRequestConfig} from "./requestModel.ts";
import {BaseError} from "./errorModel.ts";


export class BaseAPI {
    async request<T>(config: IRequestConfig): Promise<AxiosResponse<T>> {
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
                const errorMessage = error.response.data.error.message || 'An error occurred';
                throw new BaseError(
                    errorMessage,
                    error.response.status,
                );
            } else {
                throw new BaseError('Network error or request failed', 500);
            }
        }
    }
}

export default BaseAPI;
