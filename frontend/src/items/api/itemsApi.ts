//get categories
import {BaseRequest} from "../../common/models/request.model.ts";
import createAPIRequest from "../../common/models/api.model.ts";

const itemsRoot = 'items/';

export const getCategories = async (): Promise<any> => {
    const requestConfig = new BaseRequest('GET', itemsRoot + 'categories/');
    const response = await createAPIRequest(requestConfig);
    return response.data;
};