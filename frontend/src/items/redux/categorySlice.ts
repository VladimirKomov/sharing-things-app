import {Category} from "../../common/models/category.model.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getCategories} from "../api/itemsApi.ts";
import {RootState} from "../../store.ts";

interface CategoryState {
    categories: Category[];
    selectedCategory: Category | null;
    loading: boolean;
    error: {
        message: string | null,
    };
}

const initialState: CategoryState = {
    categories: [],
    selectedCategory: null,
    loading: false,
    error: {
        message: null,
    },
}

// fetch categories from the API
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
    reducers: {
        setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
            state.selectedCategory = action.payload;
        },
    },
    extraReducers: (builder) => {
        // handle different states of category fetching process
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

export const {setSelectedCategory} = categoriesSlice.actions;

export const selectCategories = (state: RootState) => state.categories.categories;
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;
export const selectLoading = (state: RootState) => state.categories.loading;
export const selectError = (state: RootState) => state.categories.error;