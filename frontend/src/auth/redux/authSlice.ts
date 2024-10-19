import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {loginAPI} from "../api/authAPI.ts";

interface AuthSlice {
    token: {
        refresh: string | null,
        access: string | null,
    }
    loading: boolean;
    error: string | null;
}

const initialState: AuthSlice = {
    token: {
        refresh: null,
        access: null,
    },
    loading: false,
    error: null,
}

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: {usernameOrEmail: string; password: string}) => {
        return await loginAPI(credentials);
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
                state.error = null;
            });
            builder.addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder.addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred.';
            });
        }
})

export default authSlice.reducer;