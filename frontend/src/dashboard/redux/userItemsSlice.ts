import {createSlice} from "@reduxjs/toolkit";
import {Item} from "../../common/models/items.model.ts";
import {RootState} from "../../common/store.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";
import {delUserItem, getUserItemById, getUserItems, putUserItem} from "../api/dashboardApi.ts";


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

// Protected routes
export const fetchUserItems = createCommonThunk('userItems/fetchUserItems', getUserItems, {requiresAuth: true});
export const fetchUserItemById = createCommonThunk('userItems/fetchUserItemById', getUserItemById, {requiresAuth: true});
export const updateUserItem = createCommonThunk('userItems/updateUserItem', putUserItem, {requiresAuth: true});
export const removeUserItem = createCommonThunk('userItems/removeUserItem', delUserItem, {requiresAuth: true});

const userItemsSlice = createSlice({
    name: 'userItems',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserItems.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(fetchUserItems.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload.data;
            })
            .addCase(fetchUserItems.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'Failed to fetch user items';
            });

        builder
            .addCase(fetchUserItemById.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(fetchUserItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload.data;
            })
            .addCase(fetchUserItemById.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'Failed to fetch item details';
            });

        builder
            .addCase(updateUserItem.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(updateUserItem.fulfilled, (state, action) => {
                const updatedItem = action.payload.data;
                console.log('#updatedItem', updatedItem);
                console.log('#Items', state.page.items);
                const index = state.page.items.findIndex(item => item.id === updatedItem.id);
                console.log("#Index", index);
                if (index !== -1) {
                    state.page.items[index] = updatedItem;
                }
                state.loading = false;
            })
            .addCase(updateUserItem.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'Failed to update user items';
            });

        builder
            .addCase(removeUserItem.pending, (state) => {
                state.loading = true;
                state.error.message = null;
            })
            .addCase(removeUserItem.fulfilled, (state, action) => {
                const removedItemId = action.payload;
                state.page.items = state.page.items.filter(item => item.id !== removedItemId);
                state.loading = false;
                state.error.message = null;
            })
            .addCase(removeUserItem.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'Failed to remove the user item';
            });
    },
});

export default userItemsSlice.reducer;

export const selectUserSelectedItem = (state: RootState) => state.userItems.selectedItem;

export const selectUserItems = (state: RootState) => state.userItems.page.items;
export const selectUserItemsHasNextPage = (state: RootState) => state.userItems.page.hasNextPage;
export const selectUserItemsHasPreviousPage = (state: RootState) => state.userItems.page.hasPreviousPage;

export const selectUserItemsLoading = (state: RootState) => state.userItems.loading;
export const selectUserItemsError = (state: RootState) => state.userItems.error;
