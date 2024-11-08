import {RequestConfig} from "../../common/models/request.model.ts";
import {dashboardRoot} from "../../dashboard/api/dashboardApi.ts";

export const getOrders = (params?: Record<string, string>): RequestConfig => {
    return {
        method: 'GET',
        url: dashboardRoot + 'orders/',
        params: params,
    };
};