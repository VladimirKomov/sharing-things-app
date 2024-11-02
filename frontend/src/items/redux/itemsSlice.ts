import {createSlice} from "@reduxjs/toolkit";
import {Item} from "../../common/models/items.model.ts";
import {delItem, getItems, postItem, putItem} from "../api/itemsApi.ts";
import {RootState} from "../../store.ts";
import createAuthThunk from "../../common/models/createAuthThunk.model.ts";

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

export const fetchItems = createAuthThunk('items/fetchItems', getItems);

export const createItem = createAuthThunk('items/createItem', postItem);
export const updateItem = createAuthThunk('items/updateItem', putItem);
export const removeItem = createAuthThunk('items/removeItem', delItem);

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.page = action.payload.data;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.error.message || 'An error occurred during fetch items.';
            })
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