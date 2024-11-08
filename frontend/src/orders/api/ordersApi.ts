import {RequestConfig} from "../../common/models/request.model.ts";
import {dashboardRoot} from "../../dashboard/api/dashboardApi.ts";

export const getOrders = (params?: Record<string, string>): RequestConfig => {
    return {
        method: 'GET',
        url: dashboardRoot + 'orders/',
        params: params,
    };
};

export const getOrderById = (id: string): RequestConfig => {
    return {
        method: 'GET',
        url: `${dashboardRoot}orders/${id}/`,
    };
};

interface PostOrderData{
    data: FormData;
}

export const postOrder = (credentials: PostOrderData): RequestConfig => {
    return {
        method: 'POST',
        url: `${dashboardRoot}orders/`,
        data: credentials.data,
    };
};

interface PutOrderData {
    id: string;
    data: FormData;
}

export const putOrder = (credentials: PutOrderData): RequestConfig => {
    const {id, data} = credentials;
    return {
        method: 'PUT',
        url: `${dashboardRoot}orders/${id}/`,
        data: data,
    };
};