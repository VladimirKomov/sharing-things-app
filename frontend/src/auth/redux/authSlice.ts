import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkTokenAPI, loginAPI, logoutAPI, registerAPI} from "../api/authAPI";
import Cookies from 'js-cookie';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {RootState} from "../../common/store";
import createCommonThunk from "../../common/models/thunk.model";

export interface Token {
    access: string;
    refresh: string;
}

interface AuthSlice {
    token: Token | null;
    currentUserId: number | null;
    loading: boolean;
    error: string | null;
}

// Check if the token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.exp) {
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        }
        return false;
    } catch (error) {
        return true;
    }
};

// Get the user ID from the token
interface CustomJwtPayload extends JwtPayload {
    user_id?: number;
}

const getUserIdFromToken = (token: string): number | null => {
    try {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        return decoded.user_id || null;
    } catch (error) {
        return null;
    }
};

// Get the token from cookies
const getToken = (): Token | null => {
    const refresh = Cookies.get('refresh_token');
    const access = Cookies.get('access_token');

    if (refresh && access) {
        if (!isTokenExpired(refresh)) {
            return {
                access,
                refresh,
            };
        } else {
            console.warn('Access token is expired');
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
        }
    }
    return null;
};

// Get the token from cookies
const token = getToken();

const initialState: AuthSlice = {
    token: token,
    currentUserId: token ? getUserIdFromToken(token.refresh) : null,
    loading: false,
    error: null,
};

export const login = createCommonThunk('auth/login', loginAPI);
export const register = createCommonThunk('auth/register', registerAPI);
export const logout = createCommonThunk('auth/logout', logoutAPI);
export const checkToken = createCommonThunk('auth/checkToken', checkTokenAPI, {requiresAuth: true});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<Token>) => {
            const newToken = action.payload;
            state.token = newToken;
            Cookies.set('access_token', newToken.access, {expires: 7, secure: true, sameSite: 'Strict'});
            Cookies.set('refresh_token', newToken.refresh, {expires: 7, secure: true, sameSite: 'Strict'});
        },
        setLogout: (state) => {
            state.token = null;
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
        },
    },
    extraReducers: (builder) => {
        // login
        builder.addCase(login.fulfilled, (state, action) => {
            const token: Token = action.payload.data;
            state.token = token;
            // Save the token to cookies
            Cookies.set('access_token', token.access, {expires: 7, secure: true, sameSite: 'Strict'});
            Cookies.set('refresh_token', token.refresh, {expires: 7, secure: true, sameSite: 'Strict'});
            state.loading = false;
            state.error = null;
        });
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        });

        // registration
        builder.addCase(register.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload.message;
        });

        // logout
        builder.addCase(logout.fulfilled, (state) => {
            state.token = null;
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            state.loading = false;
            state.error = null;
        });
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(logout.rejected, (state) => {
            state.loading = false;
            state.token = null;
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
        });
    }
});

export const {setToken, setLogout} = authSlice.actions;

export const selectToken = (state: RootState) => state.auth.token;
export const selectTokenAccess = (state: RootState) => state.auth.token?.access;
export const selectError = (state: RootState) => state.auth.error;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectCurrentUserId = (state: RootState) => state.auth.currentUserId;

export default authSlice.reducer;