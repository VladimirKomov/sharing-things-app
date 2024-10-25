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
};

export default createAPIRequest;
