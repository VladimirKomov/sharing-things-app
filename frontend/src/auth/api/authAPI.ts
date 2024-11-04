import {RequestConfig} from "../../common/models/request.model.ts";
import {Token} from "../redux/authSlice.ts";

const usersRoot = 'users/';

export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}


export interface ReqCredentials {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    password2: string;
}

//get user
export const loginAPI = (credentials: LoginCredentials): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'login/',
        data: credentials,
        headers: {
            'Content-Type': 'application/json',
        },
    };
};
// register user
export const registerAPI = (credentials: ReqCredentials): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'register/',
        data: credentials,
        headers: {
            'Content-Type': 'application/json',
        },
    };
};
//log out
export const logoutAPI = (refresh_token: string): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'logout/',
        data: {refresh_token},
        headers: {
            'Content-Type': 'application/json',
        },
    };
}

// renew the token
export const refreshTokenAPI = (refresh: string): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'token/refresh/',
        data: {refresh},
        headers: {
            'Content-Type': 'application/json',
        },
    };
}

//check token
export const checkTokenAPI = (token: Token): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'token/verify/',
        data: {token: token},
        headers: {
            'Content-Type': 'application/json',
        },
    };
}










