import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Token, loginAPI, registerAPI, logoutAPI} from "../api/authAPI.ts";
import Cookies from 'js-cookie';
import {RootState} from "../../store.ts";

interface AuthSlice {
    token: Token
    loading: boolean;
    error: {
        message: string | null,
    };
    isRegistered: boolean;
}

const initialState: AuthSlice = {
    token: {
        refresh: null,
        access: null,
    },
    loading: false,
    error: {
        message: null,
    },
    isRegistered: false,
}

const createAuthThunk = (type: string, apiFunction: (credentials: any) => Promise<any>) => {
    return createAsyncThunk(
        type,
        async (credentials: any, {rejectWithValue}) => {
            try {
                return await apiFunction(credentials);
            } catch (error: any) {
                return rejectWithValue(error.message || 'Unexpected error occurred');
            }
        }
    );
};

export const login = createAuthThunk('auth/login', loginAPI);
export const register = createAuthThunk('auth/register', registerAPI);
export const logout = createAuthThunk('auth/logout', logoutAPI);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //login
        builder.addCase(login.fulfilled, (state, action) => {
            const {access, refresh} = action.payload;
            state.token.access = access;
            state.token.refresh = refresh;
            //storing keys in cookies
            Cookies.set('access_token', access, {expires: 7, secure: true, sameSite: 'Strict'});
            Cookies.set('refresh_token', refresh, {expires: 7, secure: true, sameSite: 'Strict'});

            state.loading = false;
            state.error.message = null;
        });
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error.message = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error.message = typeof action.payload === 'string'
                ? action.payload
                : 'An error occurred.'
        });
        //register
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
            state.error.message = null;
            state.isRegistered = true;
        });
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error.message = null;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error.message = typeof action.payload === 'string'
                ? action.payload
                : 'An error occurred during registration.';
        });
        // logout
        builder.addCase(logout.fulfilled, (state) => {
            state.token = {refresh: null, access: null};
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            state.loading = false;
            state.error.message = null;
        });
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error.message = null;
        });
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error.message = typeof action.payload === 'string'
                ? action.payload
                : 'An error occurred during logout.';
        });
    }
})

export const selectToken = (state: RootState) => state.auth.token;
export const selectError = (state: RootState) => state.auth.error;
export const selectLoading = (state: RootState) => state.auth.loading;
export default authSlice.reducer;