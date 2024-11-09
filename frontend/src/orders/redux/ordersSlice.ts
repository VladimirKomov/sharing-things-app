import {createSlice} from '@reduxjs/toolkit';
import createCommonThunk from "../../common/models/thunk.model.ts";
import {getOrders, getOwnerOrders, postOrder, putOrderStatus} from "../api/ordersApi.ts";
import {Order} from "../../common/models/order.model.ts";
import {RootState} from "../../common/store.ts";

interface PaginationState {
    orders: Order[];
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface OrderState {
    page: PaginationState;
    selectedOrder: Order | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    page: {
        orders: [],
        totalOrders: 0,
        totalPages: 0,
        currentPage: 0,
        hasNextPage: true,
        hasPreviousPage: false,
    },
    selectedOrder: null,
    loading: false,
    error: null,
};

export const fetchOrders = createCommonThunk('orders/fetchOrders', getOrders, {requiresAuth: true});
export const fetchOwnerOrders = createCommonThunk('orders/fetchOwnerOrders', getOwnerOrders, {requiresAuth: true});
// export const fetchOrderById = createCommonThunk('orders/fetchOrderById', getOrderById, {requiresAuth: true});
export const createOrder = createCommonThunk('orders/createOrder', postOrder, {requiresAuth: true});
export const updateOrderStatus = createCommonThunk('orders/updateOrderStatus', putOrderStatus, {requiresAuth: true});

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearOrders(state) {
            state.page = initialState.page;
        }
    },
    extraReducers: (builder) => {
        // fetchOrders reducer
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                const page: PaginationState = action.payload.data;
                page.orders = [...state.page.orders, ...page.orders];
                state.page = page;
                state.error = null;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load orders';
            });
        // fetchOwnerOrders reducer
        builder
            .addCase(fetchOwnerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOwnerOrders.fulfilled, (state, action) => {
                state.loading = false;
                const page: PaginationState = action.payload.data;
                page.orders = [...state.page.orders, ...page.orders];
                state.page = page;
                state.error = null;
            })
            .addCase(fetchOwnerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load orders';
            });
        // updateOrderStatus reducer
        builder
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder: Order = action.payload.data;
                const index = state.page.orders.findIndex(order => order.id === updatedOrder.id);
                if (index !== -1) {
                    state.page.orders[index] = updatedOrder;
                }
                state.selectedOrder = updatedOrder;
                state.error = null;
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update order status';
            });
    },
});

export default ordersSlice.reducer;

export const {clearOrders} = ordersSlice.actions;

export const selectOrders = (state: RootState) => state.orders.page.orders;
export const selectOrderById = (state: RootState, orderId: number) =>
    state.orders.page.orders.find(order => order.id === orderId);
export const selectSelectedOrder = (state: RootState) => state.orders.selectedOrder;
export const selectCurrentPage = (state: RootState) => state.orders.page.currentPage;
export const selectTotalOrders = (state: RootState) => state.orders.page.totalOrders;
export const selectOrderLoading = (state: RootState) => state.orders.loading;
export const selectOrderError = (state: RootState) => state.orders.error;
