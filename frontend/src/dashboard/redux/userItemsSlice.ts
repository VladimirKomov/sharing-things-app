import {createSlice} from "@reduxjs/toolkit";
import {Item} from "../../common/models/items.model.ts";
import {RootState} from "../../common/store.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";
import {delUserItem, getUserItemById, getUserItems, postUserItem, putUserItem} from "../api/dashboardApi.ts";


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
    error: string | null;
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
    error: null,
};

// Protected routes
export const fetchUserItems = createCommonThunk('userItems/fetchUserItems', getUserItems, {requiresAuth: true});
export const fetchUserItemById = createCommonThunk('userItems/fetchUserItemById', getUserItemById, {requiresAuth: true});
export const createUserItem = createCommonThunk('userItems/createUserItem', postUserItem, {requiresAuth: true});
export const updateUserItem = createCommonThunk('userItems/updateUserItem', putUserItem, {requiresAuth: true});
export const removeUserItem = createCommonThunk('userItems/removeUserItem', delUserItem, {requiresAuth: true});

const userItemsSlice = createSlice({
    name: 'userItems',
    initialState,
    reducers: {
        clearUserItemsPage: (state) => {
            state.page.items = [];
        }
    },
    extraReducers: (builder) => {
        //get user items
        builder
            .addCase(fetchUserItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserItems.fulfilled, (state, action) => {
                state.loading = false;
                const page: PaginationState = action.payload.data;
                page.items = [...state.page.items, ...page.items];
                state.page = page;
                state.error = null;
            })
            .addCase(fetchUserItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // get user item by id
        builder
            .addCase(fetchUserItemById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserItemById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedItem = action.payload.data;
            })
            .addCase(fetchUserItemById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        //add new item
        builder
            .addCase(createUserItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUserItem.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createUserItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // update user item by id
        builder
            .addCase(updateUserItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserItem.fulfilled, (state, action) => {
                const updatedItem = action.payload.data;
                const index = state.page.items.findIndex(item => item.id === updatedItem.id);
                if (index !== -1) {
                    state.page.items[index] = updatedItem;
                }
                state.loading = false;
            })
            .addCase(updateUserItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
        // delete user item by id
        builder
            .addCase(removeUserItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeUserItem.fulfilled, (state, action) => {
                const id = action.payload.data.id;
                state.page.items = state.page.items.filter(item => item.id !== id);
                state.loading = false;
                state.error = null;
            })
            .addCase(removeUserItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userItemsSlice.reducer;

export const {clearUserItemsPage} = userItemsSlice.actions;

export const selectUserSelectedItem = (state: RootState) => state.userItems.selectedItem;

export const selectUserItems = (state: RootState) => state.userItems.page.items;
export const selectUserItemsHasNextPage = (state: RootState) => state.userItems.page.hasNextPage;
export const selectUserItemsHasPreviousPage = (state: RootState) => state.userItems.page.hasPreviousPage;
export const selectUserItemsCurrentPage = (state: RootState) => state.userItems.page.currentPage;
export const selectUserItemsTotalPages = (state: RootState) => state.userItems.page.totalPages;

export const selectUserItemsLoading = (state: RootState) => state.userItems.loading;
export const selectUserItemsError = (state: RootState) => state.userItems.error;
