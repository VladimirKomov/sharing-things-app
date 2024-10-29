import {BaseRequest, RequestConfig} from "../../common/models/request.model.ts";
import createAPIRequest from "../../common/models/api.model.ts";
import Cookies from "js-cookie";
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
    return response.data;
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
export const logoutAPI = async (): Promise<any> => {
    const refresh_token = Cookies.get('refresh_token');
    console.log(refresh_token);
    const requestConfig: RequestConfig = {
        method: 'POST',
        url: usersRoot + 'logout/',
        data: { refresh_token },
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const request = new BaseRequest(requestConfig);
    const response = await createAPIRequest<any>(request);
    return response.message;
}






