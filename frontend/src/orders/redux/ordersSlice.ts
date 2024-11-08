import {createSlice} from '@reduxjs/toolkit';
import createCommonThunk from "../../common/models/thunk.model.ts";
import {getOrders} from "../api/ordersApi.ts";
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
    loading: false,
    error: null,
};

// Асинхронный thunk для получения заказов
export const fetchOrders = createCommonThunk('orders/fetchOrders', getOrders, {requiresAuth: true});

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        // Место для дополнительных синхронных действий
    },
    extraReducers: (builder) => {
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
    },
});

export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.page.orders;
export const selectOrderById = (state: RootState, orderId: number) =>
    state.orders.page.orders.find(order => order.id === orderId);
export const selectCurrentPage = (state: RootState) => state.orders.page.currentPage;
export const selectTotalOrders = (state: RootState) => state.orders.page.totalOrders;
export const selectLoading = (state: RootState) => state.orders.loading;
export const selectError = (state: RootState) => state.orders.error;
