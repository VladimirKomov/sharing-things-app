import {BaseRequest} from "../../common/models/request.model.ts";
import createAPIRequest from "../../common/models/api.model.ts";

const itemsRoot = 'items/';

export const getCategories = async (): Promise<any> => {
    const requestConfig = new BaseRequest({
        method: 'GET',
        url: itemsRoot + 'categories/',
    });
    const response = await createAPIRequest(requestConfig);
    return response.data;
};

export const getItems = async (params?: Record<string, string>): Promise<any> => {
    const requestConfig = new BaseRequest({
        method: 'GET',
        url: itemsRoot + 'items/',
        params: params,
    });
    const response = await createAPIRequest(requestConfig);
    return response.data;
};

export const postItem = async (data?: any): Promise<any> => {
    const requestConfig = new BaseRequest({
        method: 'POST',
        url: itemsRoot + 'items/',
        data: data,
    });
    const response = await createAPIRequest(requestConfig);
    return response.data;
};

export const putItem = async (data?: any): Promise<any> => {
    const requestConfig = new BaseRequest({
        method: 'PUT',
        url: itemsRoot + 'items/',
        data: data,
    });
    const response = await createAPIRequest(requestConfig);
    return response.data;
};

export const delItem = async (params?: Record<string, string>): Promise<any> => {
    const requestConfig = new BaseRequest({
        method: 'DELETE',
        url: itemsRoot + 'items/',
        params: params,
    });
    const response = await createAPIRequest(requestConfig);
    return response.data;
};
