import {RequestConfig} from "../../common/models/request.model.ts";

const itemsRoot = 'items/';

export const getCategories = (): RequestConfig => {
    return {
        method: 'GET',
        url: itemsRoot + 'categories/',
    };
};

export const getItems = (params?: Record<string, string>): RequestConfig => {
    return {
        method: 'GET',
        url: itemsRoot + 'items/',
        params: params,
    };
};

export const postItem = (data?: any): RequestConfig => {
    return {
        method: 'POST',
        url: itemsRoot + 'items/',
        data: data,
    };
};

export const putItem = (data?: any): RequestConfig => {
    return {
        method: 'PUT',
        url: itemsRoot + 'items/',
        data: data,
    };
};

export const delItem = (params?: Record<string, string>): RequestConfig => {
    return {
        method: 'DELETE',
        url: itemsRoot + 'items/',
        params: params,
    };
};
