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

export const getItemById = (id: string): RequestConfig => {
    return {
        method: 'GET',
        url: `${itemsRoot}items/${id}/`,
    };
};


export const postItem = (id: string, data?: any): RequestConfig => {
    return {
        method: 'POST',
        url: `${itemsRoot}items/${id}/`,
        data: data,
    };
};


