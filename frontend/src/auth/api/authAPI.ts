import {BaseRequest} from "../../models/requestModel.ts";
import createAPIRequest from "../../models/apiModel.ts";


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
    const requestConfig = new BaseRequest('POST', '/login/', credentials);
    const response = await createAPIRequest<Token>(requestConfig);
    return response.data;
};
// register user
export const registerAPI = async (credentials: ReqCredentials): Promise<any> => {
    const requestConfig = new BaseRequest('POST', '/register/', credentials);
    const response = await createAPIRequest<any>(requestConfig);
    return response.message;
};






