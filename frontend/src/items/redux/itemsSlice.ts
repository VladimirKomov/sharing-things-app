import {createSlice} from "@reduxjs/toolkit";
import {Item} from "../../common/models/items.model.ts";
import {delItem, getItems, postItem, putItem} from "../api/itemsApi.ts";
import {RootState} from "../../common/store.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";
import {getItemsUser} from "../../dashboard/api/dashboardApi.ts";

interface ItemsState {
    page: {
        items: Item[],
        totalItems: number,
        totalPages: number,
        currentPage: number,
        hasNextPage: boolean,
        hasPreviousPage: boolean,

    };
    loading: boolean;
    error: {
        message: string | null,
    };
}

const initialState: ItemsState = {
    page: {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        hasNextPage: true,
        hasPreviousPage: false,
    },
    loading: false,
    error: {
        message: null,
    },
}

export const fetchItems = createCommonThunk('items/fetchItems', getItems);
export const fetchItemsUser = createCommonThunk('items/fetchItemsUser', getItemsUser, {requiresAuth: true});

export const createItem = createCommonThunk('items/createItem', postItem);
export const updateItem = createCommonThunk('items/updateItem', putItem);
export const removeItem = createCommonThunk('items/removeItem', delItem);

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload.data;
                state.error.message = null;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'An error occurred during fetch items.';
            });

        builder
            .addCase(fetchItemsUser.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(fetchItemsUser.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload.data;
            })
            .addCase(fetchItemsUser.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'Failed to fetch user items';
            });
        // .addCase(createItem.fulfilled, (state, action) => {
        //     state.items.push(action.payload);
        // })
        // .addCase(updateItem.fulfilled, (state, action) => {
        //     const index = state.items.findIndex(item => item.id === action.payload.id);
        //     if (index !== -1) {
        //         state.items[index] = action.payload;
        //     }
        // })
        // .addCase(removeItem.fulfilled, (state, action) => {
        //     state.items = state.items.filter(item => item.id !== action.payload);
        // });
    },
})

export default itemsSlice.reducer;

export const selectItems = (state: RootState) => state.items.page.items;
export const selectHasNextPage = (state: RootState) => state.items.page.hasNextPage;
export const selectHasPreviousPage = (state: RootState) => state.items.page.hasPreviousPage;
export const selectLoading = (state: RootState) => state.items.loading;
export const selectError = (state: RootState) => state.items.error;