import {Item} from "../../common/models/items.model.ts";
import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../store.ts";
import {getItemsUser} from "../api/dashboardApi.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";

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


export const fetchItemsUser = createCommonThunk('dashboard/fetchUserItems', getItemsUser);

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
                state.items = action.payload.data;
            })
            .addCase(fetchItemsUser.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.payload;
            });
    }
})

export const selectDashboardItems = (state: RootState) => state.dashboard.items;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;