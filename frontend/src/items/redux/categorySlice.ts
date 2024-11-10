import {Category} from "../../common/models/category.model.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getCategories} from "../api/itemsApi.ts";
import {RootState} from "../../common/store.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";

interface CategoryState {
    categories: Category[];
    selectedCategory: Category | null;
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
}

export const fetchCategories = createCommonThunk('categories/fetchCategories', getCategories);

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
            state.selectedCategory = action.payload;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        },
    },
    extraReducers: (builder) => {
        // handle different states of category fetching process
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload.data;
            state.error = null;
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})

export default categoriesSlice.reducer;

export const {setSelectedCategory, clearSelectedCategory} = categoriesSlice.actions;

export const selectCategories = (state: RootState) => state.categories.categories;
export const selectSelectedCategory = (state: RootState) => state.categories.selectedCategory;
export const selectLoading = (state: RootState) => state.categories.loading;
export const selectError = (state: RootState) => state.categories.error;