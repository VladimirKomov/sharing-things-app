import {BaseRequest} from "../../models/requestModel.ts";
import BaseAPI from "../../models/apiModel.ts";

export interface Credentials {
    usernameOrEmail: string;
    password: string;
}

export interface Token {
    refresh: string | null,
    access: string | null,
}

const api = new BaseAPI();

//get token
export const loginAPI = async (credentials: Credentials): Promise<Token> => {
    const requestLogin = new BaseRequest('POST', `/login/`, credentials);
    try {
        const response = await api.request<Token>(requestLogin);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};





