// import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
// import {AppDispatch, RootState} from "../../store";
// import {authorizedRequest} from "../../auth/api/authAPI.ts";
//
//
// export interface UserSettings {
//     firstName: string;
//     lastName: string;
//     phoneNumber: string;
//     address: string;
//     latitude: number | null;
//     longitude: number | null;
// }
//
// interface UserSettingsState {
//     settings: UserSettings | null;
//     loading: boolean;
//     error: {
//         message: string;
//     };
// }
//
// const initialState: UserSettingsState = {
//     settings: null,
//     loading: false,
//     error: {
//         message: '',
//     },
// };
//
// // Получение настроек пользователя
// export const fetchUserSettings = createAsyncThunk<
//     any,
//     void,
//     { state: RootState; dispatch: AppDispatch }
// >(
//     'userSettings/fetchUserSettings',
//     async (_, {getState, dispatch, rejectWithValue}) => {
//         const requestConfig = {
//             method: 'GET',
//             url: 'users/settings/',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         };
//
//         try {
//             return await authorizedRequest(requestConfig, getState, dispatch);
//         } catch (error: any) {
//             return rejectWithValue(error.message || 'Unexpected error occurred');
//         }
//     }
// );
//
// // Обновление настроек пользователя
// export const updateUserSettingsThunk = createAsyncThunk<
//     any,
//     UserSettings,
//     { state: RootState; dispatch: AppDispatch }
// >(
//     'userSettings/updateUserSettings',
//     async (settings, {getState, dispatch, rejectWithValue}) => {
//         const requestConfig = {
//             method: 'PATCH',
//             url: 'users/settings/',
//             data: settings,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         };
//
//         try {
//             return await authorizedRequest(requestConfig, getState, dispatch);
//         } catch (error: any) {
//             return rejectWithValue(error.message || 'Unexpected error occurred');
//         }
//     }
// );
//
// export const userSettingsSlice = createSlice({
//     name: 'userSettings',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchUserSettings.pending, (state) => {
//                 state.loading = true;
//                 state.error.message = '';
//             })
//             .addCase(fetchUserSettings.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.settings = action.payload;
//             })
//             .addCase(fetchUserSettings.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error.message = action.payload as string;
//             })
//             .addCase(updateUserSettingsThunk.pending, (state) => {
//                 state.loading = true;
//                 state.error.message = '';
//             })
//             .addCase(updateUserSettingsThunk.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.settings = action.payload;
//             })
//             .addCase(updateUserSettingsThunk.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error.message = action.payload as string;
//             });
//     }
// });
//
// export const selectUserSettings = (state: RootState) => state.userSettings.settings;
// export const selectUserSettingsLoading = (state: RootState) => state.userSettings.loading;
// export const selectUserSettingsError = (state: RootState) => state.userSettings.error;
//
// export default userSettingsSlice.reducer;
