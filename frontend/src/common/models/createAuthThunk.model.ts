import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../store.ts";

interface ThunkOptions {
    requiresAuth?: boolean;
}

//common thunk
//if there are ThunkOptions, we process them in tokenMiddleware
const createCommonThunk =  (
    type: string,
    apiFunction: (credentials?: any) => Promise<any>,
    options?: ThunkOptions
): any => {
    return createAsyncThunk(
        type,
        async (credentials: any = {}, {rejectWithValue}) => {
            try {
                if (credentials) {
                    return await apiFunction(credentials);
                }
                return await apiFunction();
            } catch (error: any) {
                return rejectWithValue(error || "Unexpected error occurred");
            }
        },
        {
            condition: (_, {getState}) => {
                // check if authorization is required and if there is a token
                if (options?.requiresAuth) {
                    const state = getState() as RootState;
                    if (!state.auth.token) {
                        throw new Error("Authorization is required to complete this request.");
                    }
                }
                return true;
            },
            getPendingMeta: () => ({
                requiresAuth: options?.requiresAuth ?? false,
            }),
        }
    );
};

export default createCommonThunk;
