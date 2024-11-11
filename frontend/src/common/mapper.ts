import {BaseError} from "./models/error.model.ts";
import {BaseResponse} from "./models/response.model.ts";

export const errorResponseToBaseError = (errorResponse: any): BaseError => {
    return new BaseError(
        errorResponse.message,
        errorResponse.code,
        errorResponse.details);
}

export const errorToBaseError = (error: any): BaseError => {
    let details: string = '';
    if (error.response.data) {
        details = JSON.stringify(error.response.data, null, 2);
        details = details
            .replace(/\\n|\\t|\\\"|[{}\[\]\\"]/g, "") // del: \n, \t, \", {, }, [, ], \
            .replace(/\s+/g, " ") // change spaces
            .trim();
    }
    return new BaseError(
        error.message,
        error.status,
        details);
}

export const responseToBaseResponse = <T>(responseApi: any): BaseResponse<T> => {
    return new BaseResponse(
        responseApi.data.data,
        responseApi.data.message,
        responseApi.data.code);
}