import {RequestConfig} from "../../common/models/request.model.ts";

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
    };
};
// register user
export const registerAPI = (credentials: ReqCredentials): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'register/',
        data: credentials,
    };
};
//log out
export const logoutAPI = (refresh_token: string): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'logout/',
        data: {refresh_token},
    };
}

// renew the token
export const refreshTokenAPI = (refresh: string): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'token/refresh/',
        data: {refresh},
    };
}

//check token
export const checkTokenAPI = (): RequestConfig => {
    return {
        method: 'POST',
        url: usersRoot + 'token/verify/',
    };
}










