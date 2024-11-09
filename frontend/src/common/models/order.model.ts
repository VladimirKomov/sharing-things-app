export const ORDER_STATUSES = {
    ALL: { key: 'all', displayName: 'All', buttonName: 'All' },
    PENDING: { key: 'pending', displayName: 'Pending', buttonName: 'Pending' },
    CONFIRMED: { key: 'confirmed', displayName: 'Confirmed', buttonName: 'Confirm' },
    ISSUED: { key: 'issued', displayName: 'Issued', buttonName: 'Issue' },
    RETURNED: { key: 'returned', displayName: 'Returned', buttonName: 'Return' },
    COMPLETED: { key: 'completed', displayName: 'Completed', buttonName: 'Complete' },
    CANCELED: { key: 'canceled', displayName: 'Canceled', buttonName: 'Cancel' },
    REJECTED: { key: 'rejected', displayName: 'Rejected', buttonName: 'Reject' },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;
export type OrderStatusKey = typeof ORDER_STATUSES[OrderStatus]['key'];
export type OrderStatusDesp = typeof ORDER_STATUSES[OrderStatus]['displayName'];
export type OrderStatusButton = typeof ORDER_STATUSES[OrderStatus]['buttonName'];

export const getStatusByKey = (key: string): { key: string; displayName: string; buttonName: string } | undefined => {
    return Object.values(ORDER_STATUSES).find(status => status.key === key);
};
export const getStatusDisplayNameByKey = (key: string): string => {
    return getStatusByKey(key)?.displayName || '';
};
export const getStatusButtonNameByKey = (key: string): string => {
    return getStatusByKey(key)?.buttonName || '';
};



export interface Order {
    id: number;
    itemId: number;
    itemName: string;
    ownerId: number;
    ownerName: string;
    userId: number;
    userName: string;
    status: OrderStatusKey;
    startDate: string;
    endDate: string;
    totalAmount: number;
}


// acceptable transitions
export const statusTransitions: Record<OrderStatusKey, OrderStatusKey[]> = {
    [ORDER_STATUSES.PENDING.key]: [ORDER_STATUSES.CONFIRMED.key, ORDER_STATUSES.CANCELED.key, ORDER_STATUSES.REJECTED.key],
    [ORDER_STATUSES.CONFIRMED.key]: [ORDER_STATUSES.ISSUED.key, ORDER_STATUSES.CANCELED.key],
    [ORDER_STATUSES.ISSUED.key]: [ORDER_STATUSES.RETURNED.key],
    [ORDER_STATUSES.RETURNED.key]: [ORDER_STATUSES.COMPLETED.key],
    [ORDER_STATUSES.COMPLETED.key]: [], // The completed order cannot change
    [ORDER_STATUSES.CANCELED.key]: [], // Cancelled order cannot be changed
    [ORDER_STATUSES.REJECTED.key]: [], // Rejected order cannot be changed
    [ORDER_STATUSES.ALL.key]: [], // All cannot be changed at all
};

export const availableStatus = (
    owner: boolean,
    status: OrderStatusKey): boolean => {
    if (owner) {
        return status === ORDER_STATUSES.CONFIRMED.key ||
            status === ORDER_STATUSES.REJECTED.key ||
            status === ORDER_STATUSES.ISSUED.key ||
            status === ORDER_STATUSES.COMPLETED.key;
    } else {
        return status === ORDER_STATUSES.CANCELED.key ||
            status === ORDER_STATUSES.RETURNED.key;
    }
};
