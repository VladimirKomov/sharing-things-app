import {BaseError} from "./errorModel.ts";
import {BaseResponse} from "./responseModel.ts";

export const errorResponseToBaseError = (errorResponse: any): BaseError => {
    return new BaseError(
        errorResponse.data.error.message,
        errorResponse.data.error.code,
        errorResponse.data.error.details);
}

export const responseToBaseResponse = <T>(responseApi: any): BaseResponse<T> => {
    return new BaseResponse(
        responseApi.data,
        responseApi.message,
        responseApi.code);
}