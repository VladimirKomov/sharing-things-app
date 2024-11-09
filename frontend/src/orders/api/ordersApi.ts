import {RequestConfig} from "../../common/models/request.model.ts";
import {ORDER_STATUSES, OrderStatusKey, OrderStatusDesp} from "../../common/models/order.model.ts";

const ordersRoot = 'orders/';

interface OrderFilter {
    status: OrderStatusDesp;
    startDate: string;
    endDate: string;
}

export const getOrders = (filter: OrderFilter): RequestConfig => {
    // create filter
    const urlParams = new URLSearchParams();
    if (filter.status && filter.status !== ORDER_STATUSES.ALL.displayName) urlParams.append('status', filter.status);
    if (filter.startDate) urlParams.append('start_date', filter.startDate);
    if (filter.endDate) urlParams.append('end_date', filter.endDate);
    return {
        method: 'GET',
        url: `${ordersRoot}user-orders/?${urlParams.toString()}`,
    };
};

export const getOwnerOrders = (filter: OrderFilter): RequestConfig => {
    // create filter
    const urlParams = new URLSearchParams();
    if (filter.status && filter.status !== ORDER_STATUSES.ALL.displayName) urlParams.append('status', filter.status);
    if (filter.startDate) urlParams.append('start_date', filter.startDate);
    if (filter.endDate) urlParams.append('end_date', filter.endDate);
    return {
        method: 'GET',
        url: `${ordersRoot}owner-orders/?${urlParams.toString()}`,
    };
};

interface PutOrderData {
    id: string;
    status: OrderStatusKey;
}

export const putOrderStatus = (credentials: PutOrderData): RequestConfig => {
    const {id, status} = credentials;
    return {
        method: 'PUT',
        url: `${ordersRoot}update/${id}/`,
        data: { status },
    };
};

// export const getOrderById = (id: string): RequestConfig => {
//     return {
//         method: 'GET',
//         url: `${ordersRoot}${id}/`,
//     };
// };
//
interface PostOrderData {
    data: FormData;
}

export const postOrder = (credentials: PostOrderData): RequestConfig => {
    return {
        method: 'POST',
        url: `${ordersRoot}create/`,
        data: credentials.data,
    };
};