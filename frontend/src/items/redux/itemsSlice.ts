import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Item} from "../../common/models/items.model.ts";
import {delItem, getItems, postItem, putItem} from "../api/itemsApi.ts";
import {RootState} from "../../store.ts";

interface ItemsState {
    items: Item[];
    loading: boolean;
    error: {
        message: string | null,
    };
}

const initialState: ItemsState = {
    items: [],
    loading: false,
    error: {
        message: null,
    },
}


const createAuthThunk = (type: string, apiFunction: (params?: any) => Promise<any>) => {
    return createAsyncThunk(
        type,
        async (params: any = {}, { rejectWithValue }) => {
            try {
                return await apiFunction(params);
            } catch (error: any) {
                return rejectWithValue(error.message || 'Unexpected error occurred');
            }
        }
    );
};

export const fetchItems = createAuthThunk('items/fetchItems', getItems);
// export const fetchItems = createAsyncThunk(
//     'items/fetchItems',
//     async ({ itemsPerPage, page }: { itemsPerPage: number; page: number }, { rejectWithValue }) => {
//         try {
//             const response = await getItems(itemsPerPage, page);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.message || 'Unexpected error occurred');
//         }
//     }
// );
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
                state.items = action.payload.items;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error.message = typeof action.payload === 'string'
                    ? action.payload
                    : 'An error occurred during registration.';
            })
            .addCase(createItem.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateItem.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(removeItem.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
})

export default itemsSlice.reducer;

export const selectItems = (state: RootState) => state.items.items;
export const selectLoading = (state: RootState) => state.items.loading;
export const selectError = (state: RootState) => state.items.error;