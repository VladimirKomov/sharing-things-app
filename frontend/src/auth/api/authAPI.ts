import {BaseRequest, RequestConfig} from "../../common/models/request.model.ts";
import createAPIRequest from "../../common/models/api.model.ts";

const usersRoot = 'users/';

export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
}

export interface Token {
    refresh: string | null;
    access: string | null;
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
    return response.data;
};
// register user
export const registerAPI = async (credentials: ReqCredentials): Promise<any> => {
    const requestConfig: RequestConfig = {
        method: 'POST',
        url: usersRoot + 'login/',
        data: credentials,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await createAPIRequest<any>(requestConfig);
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
    const response = await createAPIRequest<any>(requestConfig);
    return response.message;
}






