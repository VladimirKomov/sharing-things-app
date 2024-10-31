import axios, {AxiosResponse} from "axios";
import {RequestConfig} from "./request.model.ts";
import {BaseError} from "./error.model.ts";
import {errorResponseToBaseError, responseToBaseResponse} from "../mapper.ts";
import {BaseResponse} from "./response.model.ts";

const createAPIRequest = async <T>(config: RequestConfig): Promise<BaseResponse<any>> => {
    try {
        const response: AxiosResponse<T> = await axios({
            method: config.method,
            url: config.url,
            ...(config.params && { params: config.params }),
            ...(config.data && {data: config.data}),
            ...(config.headers && {headers: config.headers}),
        });
        // return response;
        return responseToBaseResponse(response);
    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;
            if (status === 401) {
                throw new BaseError('Unauthorized: Token is invalid or expired', 401);
            }
            throw errorResponseToBaseError(error.response);
        } else {
            throw new BaseError('Network error or request failed', 500);
        }
    }
};

export default createAPIRequest;
