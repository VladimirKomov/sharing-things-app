import axios from 'axios';
import {API_BASE_URL} from '../../config.ts'

interface Credentials {
    usernameOrEmail: string;
    password: string;
}

//get token
export const loginAPI = async (credentials: Credentials) => {
    const response = await axios.post(`${API_BASE_URL}/login/`, credentials);
    return response.data;
};
