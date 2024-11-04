import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../../common/store.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";
import {getUserSettings, patchUserSettings} from "../api/dashboardApi.ts";


export interface UserSettings {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
}

interface UserSettingsState {
    settings: UserSettings | null;
    loading: boolean;
    error: {
        message: string;
    };
}

const initialState: UserSettingsState = {
    settings: null,
    loading: false,
    error: {
        message: '',
    },
};


export const fetchUserSettings = createCommonThunk('userSettings/fetchUserSettings', getUserSettings, {requiresAuth: true});
export const updateUserSettings = createCommonThunk('userSettings/updateUserSettings', patchUserSettings, {requiresAuth: true});

export const userSettingsSlice = createSlice({
    name: 'userSettings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserSettings.pending, (state) => {
                state.loading = true;
                state.error.message = '';
            })
            .addCase(fetchUserSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload.data;
            })
            .addCase(fetchUserSettings.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.payload;
            })
            .addCase(updateUserSettings.pending, (state) => {
                state.loading = true;
                state.error.message = '';
            })
            .addCase(updateUserSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
            })
            .addCase(updateUserSettings.rejected, (state, action) => {
                state.loading = false;
                state.error.message = action.payload as string;
            });
    }
});

export const selectUserSettings = (state: RootState) => state.userSettings.settings;
export const selectUserSettingsLoading = (state: RootState) => state.userSettings.loading;
export const selectUserSettingsError = (state: RootState) => state.userSettings.error;

export default userSettingsSlice.reducer;
