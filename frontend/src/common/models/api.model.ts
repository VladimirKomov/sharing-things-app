import axios, {AxiosResponse} from "axios";
import {RequestConfig} from "./request.model.ts";
import {BaseError} from "./error.model.ts";
import {errorResponseToBaseError, errorToBaseError, responseToBaseResponse} from "../mapper.ts";


export const sendRequest = async <T>(
    requestConfig: RequestConfig): Promise<any> => {
    try {
        const response: AxiosResponse<T> = await axios({
            method: requestConfig.method,
            url: requestConfig.url,
            ...(requestConfig.params && {params: requestConfig.params}),
            ...(requestConfig.data && {data: requestConfig.data}),
            ...(requestConfig.headers && {headers: requestConfig.headers}),
        });
        return responseToBaseResponse(response).asObject();
    } catch (error: any) {
        if (error.response) {
            if (error.response.data.error) {
                throw errorResponseToBaseError(error.response.data.error).asObject();
            }
            console.log(error);
            throw errorToBaseError(error).asObject();
        } else {
            throw new BaseError('Network error or request failed', 500).asObject();
        }
    }
};


// const handleTokenRefresh = async (
//     refreshToken: string,
//     dispatch: AppDispatch): Promise<Token> => {
//     try {
//         const newToken = await refreshTokenAPI(refreshToken);
//         if (newToken) {
//             dispatch(setToken(newToken));
//             return newToken;
//         }
//         throw new Error('Не удалось обновить токен.');
//     } catch (error) {
//         throw new Error('Ошибка при обновлении токена. Пожалуйста, авторизуйтесь.');
//     }
// };
//
//
// export const createAuthorizedRequest = async (
//     requestConfig: RequestConfig
// ): Promise<any> => {
//     // const state = store.getState();
//     // let token = state.auth.token;
//     const token = null;
//
//     if (!token) {
//         throw new Error('Пожалуйста, авторизуйтесь.');
//     }
//
//     // Добавление токена в заголовок
//     const authorizedConfig = {
//         ...requestConfig,
//         headers: {
//             ...requestConfig.headers,
//             Authorization: `Bearer ${token.access}`,
//         },
//     };
//
//     try {
//         return await createAPIRequest(authorizedConfig);
//     } catch (error: any) {
//         // Если токен истек, пробуем обновить его
//         if (error.code === 401 && token.refresh) {
//             try {
//                 // Обновляем токен
//                 // const newToken: Token = await handleTokenRefresh(token.refresh, store.dispatch);
//
//                 // Повторный запрос с обновленным токеном
//                 const updatedConfig = {
//                     ...requestConfig,
//                     headers: {
//                         ...requestConfig.headers,
//                         Authorization: `Bearer ${newToken.access}`,
//                     },
//                 };
//                 return await createAPIRequest(updatedConfig);
//             } catch (refreshError) {
//                 throw new Error('Ошибка при обновлении токена. Пожалуйста, авторизуйтесь.');
//             }
//         } else {
//             throw error;
//         }
//     }
// };

