import {createSlice} from "@reduxjs/toolkit";
import {Item} from "../../common/models/items.model.ts";
import {delItem, getItemById, getItems, postItem, putItem} from "../api/itemsApi.ts";
import {RootState} from "../../common/store.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";
import {getItemsUser} from "../../dashboard/api/dashboardApi.ts";

interface PaginationState {
    items: Item[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface ItemsState {
    allItems: PaginationState;
    userItems: PaginationState;
    selectedItem: Item | null;
    loading: boolean;
    error: {
        message: string | null,
    };
}

const initialState: ItemsState = {
    allItems: {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        hasNextPage: true,
        hasPreviousPage: false,
    },
    userItems: {
        items: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        hasNextPage: true,
        hasPreviousPage: false,
    },
    selectedItem: null,
    loading: false,
    error: {
        message: null,
    },
}

export const fetchItems = createCommonThunk('items/fetchItems', getItems);
export const fetchItemById = createCommonThunk('items/fetchItemById', getItemById);
//protected routes
export const fetchItemsUser = createCommonThunk('items/fetchItemsUser', getItemsUser, {requiresAuth: true});
export const createItem = createCommonThunk('items/createItem', postItem);
export const updateItem = createCommonThunk('items/updateItem', putItem);
export const removeItem = createCommonThunk('items/removeItem', delItem);

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // all items
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.allItems = action.payload.data;
                state.error.message = null;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'An error occurred during fetch items.';
            });
        // iem by id
        builder
            .addCase(fetchItemById.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(fetchItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload.data;
                state.error.message = null;
            })
            .addCase(fetchItemById.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'Failed to fetch item details';
            });
        // users items
        builder
            .addCase(fetchItemsUser.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(fetchItemsUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userItems = action.payload.data;
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

export const selectSelectedItem = (state: RootState) => state.items.selectedItem;

// all items selector
export const selectAllItems = (state: RootState) => state.items.allItems.items;
export const selectAllItemsHasNextPage = (state: RootState) => state.items.allItems.hasNextPage;
export const selectAllItemsHasPreviousPage = (state: RootState) => state.items.allItems.hasPreviousPage;

// user items selector
export const selectUserItems = (state: RootState) => state.items.userItems.items;
export const selectUserItemsHasNextPage = (state: RootState) => state.items.userItems.hasNextPage;
export const selectUserItemsHasPreviousPage = (state: RootState) => state.items.userItems.hasPreviousPage;

// common selector
export const selectLoading = (state: RootState) => state.items.loading;
export const selectError = (state: RootState) => state.items.error;