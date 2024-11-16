import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkTokenAPI, loginAPI, logoutAPI, registerAPI} from "../api/authAPI";
import Cookies from 'js-cookie';
import {jwtDecode, JwtPayload} from "jwt-decode";
import {RootState} from "../../common/store";
import createCommonThunk from "../../common/models/thunk.model";
import {CurrentUser, Token} from "../../common/models/auth.model.ts";

export interface AuthSlice {
    token: Token | null;
    currentUser: CurrentUser | null;
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

// Get the current user from cookies
const getCurrentUser = (): CurrentUser | null => {
    const user = Cookies.get('current_user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
};

const initialState: AuthSlice = {
    token: getToken(),
    currentUser: getCurrentUser(),
    loading: false,
    error: null,
};

export const login = createCommonThunk('auth/login', loginAPI);
export const register = createCommonThunk('auth/register', registerAPI);
export const logout = createCommonThunk('auth/logout', logoutAPI);
export const checkToken = createCommonThunk('auth/checkToken', checkTokenAPI, {requiresAuth: true});

const saveCredentialsToCookies = (token: Token,
                                  currentUser?: CurrentUser): void => {
    Cookies.set('access_token', token.access, {expires: 7, secure: true, sameSite: 'Strict'});
    Cookies.set('refresh_token', token.refresh, {expires: 7, secure: true, sameSite: 'Strict'});
    if (currentUser) {
        Cookies.set('current_user', JSON.stringify(currentUser), {expires: 7, secure: true, sameSite: 'Strict'});
    }
};

const removeCredentialsFromCookies = (): void => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('current_user');
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<Token>) => {
            const newToken = action.payload;
            state.token = newToken;
            saveCredentialsToCookies(newToken);
        },
        setLogout: (state) => {
            state.token = null;
            removeCredentialsFromCookies();
        },
    },
    extraReducers: (builder) => {
        // login
        builder.addCase(login.fulfilled, (state, action) => {
            const token: Token = action.payload.data.token;
            const currentUser: CurrentUser = action.payload.data.user;
            state.token = token;
            state.currentUser = currentUser;
            // Save the token and user to cookies
            saveCredentialsToCookies(token, currentUser);
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
            removeCredentialsFromCookies();
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
            removeCredentialsFromCookies();
        });
    }
});

export const {setToken, setLogout} = authSlice.actions;

export const selectToken = (state: RootState) => state.auth.token;
export const selectTokenAccess = (state: RootState) => state.auth.token?.access;
export const selectError = (state: RootState) => state.auth.error;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;

export default authSlice.reducer;