import {BaseRequest, RequestConfig} from "../../common/models/request.model.ts";
import createAPIRequest from "../../common/models/api.model.ts";
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
export const loginAPI = async (credentials: LoginCredentials): Promise<any> => {
    const requestConfig: RequestConfig = {
        method: 'POST',
        url: usersRoot + 'login/',
        data: credentials,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const request = new BaseRequest(requestConfig);
    const response = await createAPIRequest<Token>(request);
    return response;
};
// register user
export const registerAPI = async (credentials: ReqCredentials): Promise<any> => {
    const requestConfig: RequestConfig = {
        method: 'POST',
        url: usersRoot + 'register/',
        data: credentials,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const request = new BaseRequest(requestConfig)
    const response = await createAPIRequest<any>(request);
    return response.message;
};
//log out
export const logoutAPI = async (refresh_token: string): Promise<any> => {
    const requestConfig: RequestConfig = {
        method: 'POST',
        url: usersRoot + 'logout/',
        data: {refresh_token},
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const request = new BaseRequest(requestConfig);
    const response = await createAPIRequest<any>(request);
    return response.message;
}

// renew the token
export const refreshToken = async (refresh: string): Promise<Token | null> => {

    const requestConfig: RequestConfig = {
        method: 'POST',
        url: usersRoot + 'token/refresh/',
        data: {refresh},
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const request = new BaseRequest(requestConfig);
    const response = await createAPIRequest<any>(request);
    // new tokens
    return response;
}

//check token
export const checkTokenAPI = async (token: Token) => {
    try {
        const requestConfig: RequestConfig = {
            method: 'POST',
            url: usersRoot + 'token/verify/',
            data: {token: token.access},
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const request = new BaseRequest(requestConfig);
        const response = await createAPIRequest<any>(request);

        if (response.code === 200) {
            // the token is valid, return it
            return response;
        }
    } catch (error: any) {
        if (error.code === 401) {
            // try to renew the token
            if (token.refresh) {
                const response = await refreshToken(token.refresh);
                return response;

            }
        }
    }
}










