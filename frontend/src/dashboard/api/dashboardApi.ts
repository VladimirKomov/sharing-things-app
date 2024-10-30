//get user
import {BaseRequest, RequestConfig} from "../../common/models/request.model.ts";
import createAPIRequest from "../../common/models/api.model.ts";

const dashboardRoot = 'dashboard/';

export const getUserItems = async (): Promise<any> => {
    const requestConfig: RequestConfig = {
        method: 'GET',
        url: dashboardRoot + 'items/',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const request = new BaseRequest(requestConfig);
    const response = await createAPIRequest(request);
    return response.data;
};