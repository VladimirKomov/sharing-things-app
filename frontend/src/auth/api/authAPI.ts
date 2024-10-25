import {BaseRequest} from "../../common/models/request.model.ts";
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
    const requestConfig = new BaseRequest('POST', usersRoot + 'login/', credentials);
    const response = await createAPIRequest<Token>(requestConfig);
    return response.data;
};
// register user
export const registerAPI = async (credentials: ReqCredentials): Promise<any> => {
    const requestConfig = new BaseRequest('POST', usersRoot + 'register/', credentials);
    const response = await createAPIRequest<any>(requestConfig);
    return response.message;
};






