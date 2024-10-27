//get categories
import {BaseRequest} from "../../common/models/request.model.ts";
import createAPIRequest from "../../common/models/api.model.ts";

const itemsRoot = 'items/';

export const getCategories = async (): Promise<any> => {
    const requestConfig = new BaseRequest('GET', itemsRoot + 'categories/');
    const response = await createAPIRequest(requestConfig);
    return response.data;
};

export const getItems = async (params?: Record<string, string>): Promise<any> => {
    const requestConfig = new BaseRequest('GET', itemsRoot + 'items/',
        params,
    );
    const response = await createAPIRequest(requestConfig);
    return response.data;
};

export const postItem = async (): Promise<any> => {
    const requestConfig = new BaseRequest('POST', itemsRoot + 'items/');
    const response = await createAPIRequest(requestConfig);
    return response.data;
}

export const putItem = async (): Promise<any> => {
    const requestConfig = new BaseRequest('PUT', itemsRoot + 'items/');
    const response = await createAPIRequest(requestConfig);
    return response.data;
}


export const delItem = async (): Promise<any> => {
    const requestConfig = new BaseRequest('DELETE', itemsRoot + 'items/');
    const response = await createAPIRequest(requestConfig);
    return response.data;
}