import {RequestConfig} from "../../common/models/request.model.ts";
import {ORDER_STATUSES, OrderStatus} from "../../common/models/order.model.ts";

const ordersRoot = 'orders/';

interface OrderFilter {
    status: OrderStatus;
    startDate: string;
    endDate: string;
}

export const getOrders = (filter: OrderFilter): RequestConfig => {
    // create filter
    const urlParams = new URLSearchParams();
    if (filter.status && filter.status !== ORDER_STATUSES.ALL) urlParams.append('status', filter.status);
    if (filter.startDate) urlParams.append('start_date', filter.startDate);
    if (filter.endDate) urlParams.append('end_date', filter.endDate);
    return {
        method: 'GET',
        url: `${ordersRoot}?${urlParams.toString()}`,
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