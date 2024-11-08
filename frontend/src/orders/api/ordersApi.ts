import {RequestConfig} from "../../common/models/request.model.ts";

const ordersRoot = 'orders/';

export const getOrders = (params?: Record<string, string>): RequestConfig => {
    return {
        method: 'GET',
        url: ordersRoot,
        params: params,
    };
};

export const getOrderById = (id: string): RequestConfig => {
    return {
        method: 'GET',
        url: `${ordersRoot}${id}/`,
    };
};

interface PostOrderData{
    data: FormData;
}

export const postOrder = (credentials: PostOrderData): RequestConfig => {
    return {
        method: 'POST',
        url: `${ordersRoot}`,
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
        url: `${ordersRoot}${id}/`,
        data: data,
    };
};