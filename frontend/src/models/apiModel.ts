import axios, {AxiosResponse} from "axios";
import {RequestConfig} from "./requestModel.ts";
import {BaseError} from "./errorModel.ts";
import {errorResponseToBaseError, responseToBaseResponse} from "./Mapper.ts";
import {Response} from "./responseModel.ts";

export class BaseAPI {
    async request<T>(config: RequestConfig): Promise<Response<T>> {
        try {
            const response: AxiosResponse<T> = await axios({
                method: config.method,
                url: config.url,
                ...(config.data && {data: config.data}),
                ...(config.headers && {headers: config.headers}),
            });
            // return response;
            return responseToBaseResponse(response);
        } catch (error: any) {
            if (error.response) {
                throw errorResponseToBaseError(error.response);
            } else {
                throw new BaseError('Network error or request failed', 500);
            }
        }
    }
}

export default BaseAPI;
