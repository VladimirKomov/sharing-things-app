import {RequestConfig} from "../../common/models/request.model.ts";
import {ORDER_STATUSES, OrderStatusKey} from "../../common/models/order.model.ts";

const ordersRoot = 'orders/';

interface OrderFilter {
    status: OrderStatusKey;
    startDate: string;
    endDate: string;
}

export const getOrders = (filter: OrderFilter): RequestConfig => {
    // create filter
    const urlParams = new URLSearchParams();
    if (filter.status && filter.status !== ORDER_STATUSES.ALL.key) urlParams.append('status', filter.status);
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
    if (filter.status && filter.status !== ORDER_STATUSES.ALL.key) urlParams.append('status', filter.status);
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
        data: {status},
    };
};

interface ItemAvailability {
    itemId: string;
    startDate: string;
    endDate: string;
}

export const getItemAvailability = (credentials: ItemAvailability): RequestConfig => {
    const {itemId, startDate, endDate} = credentials;
    return {
        method: 'GET',
        url: `${ordersRoot}check-item-availability/`,
        params: {itemId, startDate, endDate},
    };
}

interface BookedDates {
    itemId: string;
}

export const getItemWithBookedDates = (credentials: BookedDates): RequestConfig => {
    const {itemId} = credentials;
    return {
        method: 'GET',
        url: `${ordersRoot}fetch-item-with-booked-dates/`,
        params: {itemId},
    };

}

export interface PostOrderData {
    itemId: number;
    startDate: Date;
    endDate: Date;
    totalAmount: number;
}

export const postOrder = (credentials: PostOrderData): RequestConfig => {

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const data = {
        itemId: credentials.itemId,
        start_date: formatDate(credentials.startDate),
        end_date: formatDate(credentials.endDate),
        total_amount: credentials.totalAmount,
    }

    return {
        method: 'POST',
        url: `${ordersRoot}create/`,
        data: data,
    };
}
