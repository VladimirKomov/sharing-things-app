export const ORDER_STATUSES = {
    ALL: 'all',
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    ISSUED: 'issued',
    RETURNED: 'returned',
    COMPLETED: 'completed',
    CANCELED: 'canceled',
    REJECTED: 'rejected',
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

export interface Order {
    id: number;
    itemId: number;
    itemName: string;
    ownerId: number;
    ownerName: string;
    userId: number;
    userName: string;
    status: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
}