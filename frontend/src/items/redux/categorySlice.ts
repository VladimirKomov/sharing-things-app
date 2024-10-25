import {Category} from "../../common/models/category.model.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getCategories} from "../api/itemsApi.ts";

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
}

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
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
            state.error = null;
        });
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'An error occurred';
        });
    }
})

export default categoriesSlice.reducer;