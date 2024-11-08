import {createSlice} from "@reduxjs/toolkit";
import {Item} from "../../common/models/items.model.ts";
import {getItemById, getItems} from "../api/itemsApi.ts";
import {RootState} from "../../common/store.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";

interface PaginationState {
    items: Item[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface ItemsState {
    page: PaginationState;
    selectedItem: Item | null;
    loading: boolean;
    error: {
        message: string | null;
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
    selectedItem: null,
    loading: false,
    error: {
        message: null,
    },
};

// Asynchronous actions (thunks)
export const fetchItems = createCommonThunk('items/fetchItems', getItems);
export const fetchItemById = createCommonThunk('items/fetchItemById', getItemById);

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        clearPage: (state) => {
            state.page.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                const page: PaginationState = action.payload.data;
                page.items = [...state.page.items, ...page.items];
                state.page = page;
                state.error.message = null;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'An error occurred during fetch items.';
            });
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
    },
});

export default itemsSlice.reducer;

export const { clearPage } = itemsSlice.actions;

// Selectors
export const selectSelectedItem = (state: RootState) => state.items.selectedItem;

// Selectors for pagination
export const selectAllItems = (state: RootState) => state.items.page.items;
export const selectAllItemsHasNextPage = (state: RootState) => state.items.page.hasNextPage;
export const selectItemById = (itemId?: number) => (state: RootState) => state.items.page.items.find(item => item.id === itemId);

export const selectAllItemsHasPreviousPage = (state: RootState) => state.items.page.hasPreviousPage;
export const selectAllItemsCurrentPage = (state: RootState) => state.items.page.currentPage;
export const selectAllItemsTotalPages = (state: RootState) => state.items.page.totalPages;

// Common selectors
export const selectLoading = (state: RootState) => state.items.loading;
export const selectError = (state: RootState) => state.items.error;
