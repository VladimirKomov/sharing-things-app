import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Token, loginAPI, registerAPI} from "../api/authAPI.ts";
import Cookies from 'js-cookie';

interface AuthSlice {
    token: Token
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

const createAuthThunk = (type: string, apiFunction: (credentials: any) => Promise<any>) => {
    return createAsyncThunk(
        type,
        async (credentials: any, { rejectWithValue }) => {
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
            Cookies.set('access_token', access, { expires: 7, secure: true, sameSite: 'Strict' });
            Cookies.set('refresh_token', refresh, { expires: 7, secure: true, sameSite: 'Strict' });

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
    }
})

export default authSlice.reducer;