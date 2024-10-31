import {Item} from "../../common/models/items.model.ts";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../store.ts";
import {getItemsUser} from "../api/dashboardApi.ts";

interface DashboardSlice {
    items: Item[];
    loading: boolean;
    error: {
        message: string;
    };
}

const initialState: DashboardSlice = {
    items: [],
    loading: false,
    error: {
        message: '',
    },
}

const createAuthThunk = (type: string, apiFunction: (credentials?: any) => Promise<any>) => {
    return createAsyncThunk(
        type,
        async (credentials: any = {}, {rejectWithValue}) => {
            try {
                if (credentials) {
                    return await apiFunction(credentials);
                }
                return await apiFunction();
            } catch (error: any) {
                return rejectWithValue(error.message || 'Unexpected error occurred');
            }
        }
    );
};

export const fetchItemsUser = createAuthThunk('dashboard/fetchUserItems', getItemsUser);

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItemsUser.pending, (state) => {
                state.loading = true;
                state.error.message = '';
            })
            .addCase(fetchItemsUser.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchItemsUser.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.payload as string;
            });
    }
})

export const selectDashboardItems = (state: RootState) => state.dashboard.items;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;