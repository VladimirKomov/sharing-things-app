import {Category} from "../../common/models/category.model.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getCategories} from "../api/itemsApi.ts";
import {RootState} from "../../store.ts";

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: {
        message: string | null,
    };
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: {
        message: null,
    },
}

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, {rejectWithValue}) => {
        try {
            const response = await getCategories();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Unexpected error occurred');
        }
    }
);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error.message = null;
        });
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error.message = action.error.message || 'An error occurred';
        });
    }
})

export default categoriesSlice.reducer;

export const selectCategories = (state: RootState) => state.categories.categories;
export const selectLoading = (state: RootState) => state.categories.loading;
export const selectError = (state: RootState) => state.categories.error;