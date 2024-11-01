import axios, {AxiosResponse} from "axios";
import {RequestConfig} from "./request.model.ts";
import {BaseError} from "./error.model.ts";
import {errorResponseToBaseError, responseToBaseResponse} from "../mapper.ts";

const createAPIRequest = async <T>(config: RequestConfig): Promise<any> => {
    try {
        const response: AxiosResponse<T> = await axios({
            method: config.method,
            url: config.url,
            ...(config.params && {params: config.params}),
            ...(config.data && {data: config.data}),
            ...(config.headers && {headers: config.headers}),
        });
        // return response as object for redux ;
        return responseToBaseResponse(response).asObject();
    } catch (error: any) {
        if (error.response) {
            const status = error.response.status;

            if (error.response.data.error) {
                throw errorResponseToBaseError(error.response.data.error).asObject();
            }
            if (status === 401) {
                throw new BaseError('Unauthorized: Token is invalid or expired', 401).asObject();
            }

            throw new BaseError('Very bad request', 400).asObject();
        } else {
            throw new BaseError('Network error or request failed', 500).asObject();
        }
    }
};

export default createAPIRequest;
