import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkTokenAPI, loginAPI, logoutAPI, registerAPI} from "../api/authAPI.ts";
import Cookies from 'js-cookie';
import {RootState} from "../../store.ts";

export interface Token {
    refresh: string;
    access: string;
}

interface AuthSlice {
    token: Token | null;
    loading: boolean;
    error: {
        message: string | null,
    };
}

const getToken = (): Token | null => {
    const refresh = Cookies.get('refresh_token');
    const access = Cookies.get('access_token');
    if (refresh && access) {
        return {
            refresh,
            access,
        };
    }
    return null;
}

const initialState: AuthSlice = {
    token: getToken(),
    loading: false,
    error: {
        message: null,
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
                return rejectWithValue(error);
            }
        }
    );
};


export const login = createAuthThunk('auth/login', loginAPI);
export const register = createAuthThunk('auth/register', registerAPI);
export const logout = createAuthThunk('auth/logout', logoutAPI);
export const checkToken = createAuthThunk('auth/checkToken', checkTokenAPI);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //login
        builder.addCase(login.fulfilled, (state, action) => {
            const token: Token = action.payload.data;
            state.token = token;
            //storing keys in cookies
            Cookies.set('access_token', token.access, {expires: 7, secure: true, sameSite: 'Strict'});
            Cookies.set('refresh_token', token.refresh, {expires: 7, secure: true, sameSite: 'Strict'});

            state.loading = false;
            state.error.message = null;
        });
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error.message = null;
        });
        builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error.message = action.payload.message;
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
        builder.addCase(register.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error.message = action.payload.message;
        });
        // logout
        builder.addCase(logout.fulfilled, (state) => {
            state.token = null;
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            state.loading = false;
            state.error.message = null;
        });
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error.message = null;
        });
        builder.addCase(logout.rejected, (state) => {
            state.loading = false;
            //wrong token
            state.token = null;
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
        });
        //check token
        builder.addCase(checkToken.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.payload;
            state.error.message = null;
        });
        builder.addCase(checkToken.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(checkToken.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            if (action.payload.code === 401) {
                // state.token = null;
                // Cookies.remove('access_token');
                // Cookies.remove('refresh_token');
            }
        })
    }
})

export const selectToken = (state: RootState) => state.auth.token;
export const selectTokenAccess = (state: RootState) => state.auth.token?.access;
export const selectError = (state: RootState) => state.auth.error;
export const selectLoading = (state: RootState) => state.auth.loading;

export default authSlice.reducer;