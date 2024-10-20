import {BaseRequest} from "../../models/requestModel.ts";
import BaseAPI from "../../models/apiModel.ts";

interface Credentials {
    usernameOrEmail: string;
    password: string;
}

const api = new BaseAPI();

//get token
export const loginAPI = async (credentials: Credentials): Promise<{ access: string; refresh: string }> => {
    const requestLogin = new BaseRequest('POST', `/login/`, credentials);
    try {
        const response = await api.request<{ access: string; refresh: string }>(requestLogin);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};



