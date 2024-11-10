import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../store.ts";
import {createRequest, RequestConfig} from "./request.model.ts";
import {sendRequest} from "./api.model.ts";
import {refreshTokenAPI} from "../../auth/api/authAPI.ts";
import {setToken} from "../../auth/redux/authSlice.ts";

interface ThunkOptions {
    requiresAuth?: boolean;
}

export const createCommonThunk = (
    type: string,
    requestConfig: (credentials?: any) => RequestConfig,
    options?: ThunkOptions
): any => {
    return createAsyncThunk(
        type,
        async (credentials: any = {}, { rejectWithValue, getState, dispatch }) => {
            const state = getState() as RootState;
            const token = state.auth.token;
            const config = requestConfig(credentials);

            const isFormData = credentials.data instanceof FormData;

            config.headers = {
                ...(options?.requiresAuth && token ? { "Authorization": `Bearer ${token.access}` } : {}),
                ...config.headers,
            };

            if (isFormData) {
                delete config.headers['Content-Type'];
            } else {
                config.headers['Content-Type'] = "application/json";
            }

            const executeRequest = async (config: RequestConfig) => {
                try {
                    const request = createRequest(config);
                    return await sendRequest(request);
                } catch (error: any) {
                    if (options?.requiresAuth && error.code === 401 && token) {

                        const configRefresh = refreshTokenAPI(token.refresh);
                        const request = createRequest(configRefresh);
                        const response= await sendRequest(request);
                        const newToken = response.data;
                        if (newToken) {
                            dispatch(setToken(newToken));
                            if (config.headers) {
                                config.headers["Authorization"] = `Bearer ${newToken.access}`;
                            }

                            const retryRequest = createRequest(config);
                            return await sendRequest(retryRequest);
                        }
                    }
                    throw error;
                }
            };

            try {
                return await executeRequest(config);
            } catch (error: any) {

                let message: string = '';
                if (error.message) {
                    message = ` ${error.message as string}`;
                }
                if (error.details && error.details.length < 100) {
                    message = ` ${error.details as string}`;
                }
                if (!message.trim()) {
                    message = "Unexpected error occurred";
                }
                message = message.trim();

                return rejectWithValue(message);
            }
        },
    );
};

export default createCommonThunk;
