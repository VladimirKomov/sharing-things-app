import {ORDER_STATUSES, OrderStatus} from "./models/order.model.ts";

// acceptable transitions
const statusTransitions: Record<OrderStatus, OrderStatus[]> = {
    [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.CANCELED, ORDER_STATUSES.CONFIRMED],
    [ORDER_STATUSES.CONFIRMED]: [ORDER_STATUSES.ISSUED, ORDER_STATUSES.CANCELED],
    [ORDER_STATUSES.ISSUED]: [ORDER_STATUSES.RETURNED],
    [ORDER_STATUSES.RETURNED]: [ORDER_STATUSES.COMPLETED],
    [ORDER_STATUSES.COMPLETED]: [], // The completed order cannot change
    [ORDER_STATUSES.CANCELED]: [], // Cancelled order cannot be changed
    [ORDER_STATUSES.REJECTED]: [], // Rejected order cannot be changed
    [ORDER_STATUSES.ALL]: [], // All cannot be changed at all
};

// check transition
export const canTransitionToStatus = (
    currentStatus: OrderStatus,
    newStatus: OrderStatus
): boolean => {
    const possibleTransitions = statusTransitions[currentStatus] || [];
    return possibleTransitions.includes(newStatus);
};

// how use it
// const currentStatus: OrderStatus = ORDER_STATUSES.PENDING;
// const newStatus: OrderStatus = ORDER_STATUSES.CONFIRMED;
//
// if (canTransitionToStatus(currentStatus, newStatus)) {
//     console.log(`Переход с ${currentStatus} на ${newStatus} допустим.`);
// } else {
//     console.log(`Переход с ${currentStatus} на ${newStatus} недопустим.`);
// }
