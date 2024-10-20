import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loginAPI} from "../api/authAPI.ts";
import {BaseError} from "../../models/errorModel.ts";

interface AuthSlice {
    token: {
        refresh: string | null,
        access: string | null,
    }
    loading: boolean;
    error: {
        message: string | null,
    };
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
}

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: {usernameOrEmail: string; password: string}, {rejectWithValue}) => {
        try {
            return await loginAPI(credentials);
        } catch (error: any) {
            if (error instanceof BaseError) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Unexpected error occurred');
            }
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
            builder.addCase(login.fulfilled, (state, action) => {
                const { access, refresh } = action.payload;
                state.token.access = access;
                state.token.refresh = refresh;
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
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
        }
})

export default authSlice.reducer;