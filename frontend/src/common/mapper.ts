import {BaseError} from "./models/error.model.ts";
import {BaseResponse} from "./models/response.model.ts";

export const errorResponseToBaseError = (errorResponse: any): BaseError => {
    return new BaseError(
        errorResponse.message,
        errorResponse.code,
        errorResponse.details);
}

export const responseToBaseResponse = <T>(responseApi: any): BaseResponse<T> => {
    return new BaseResponse(
        responseApi.data.data,
        responseApi.data.message,
        responseApi.data.code);
}