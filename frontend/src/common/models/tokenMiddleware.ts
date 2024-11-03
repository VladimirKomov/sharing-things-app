import { Middleware } from "redux";
import { setToken, setLogout } from "../../auth/redux/authSlice";
import { refreshTokenAPI } from "../../auth/api/authAPI";
import { RootState } from "../../store";
import {BaseError} from "./error.model.ts";

export const tokenMiddleware: Middleware<{}, RootState> = ({ dispatch, getState }) => {
    let originalAction: any = null;

    return (next) => async (action: any) => {
        const state = getState();
        const token = state.auth.token;

        // check the action and authorization requirement
        if (action.type.endsWith("/pending") && action.meta?.requiresAuth) {
            // check token
            if (!token) {
                dispatch(setLogout());
                throw new BaseError("Invalid token", 403);
            }

            // save original action for repeat
            if (!originalAction) {
                originalAction = { ...action };
            }

            // add token
            action = {
                ...action,
                headers: {
                    ...action.headers,
                    Authorization: `Bearer ${token.access}`,
                },
            };

            try {
                return await next(action);
            } catch (error: any) {
                throw new BaseError(error.message, 418);
            }
        }

        // handle error 401
        if (action.type.endsWith("/rejected") && action.payload?.code === 401) {

            // check count retried
            if (originalAction?.meta?.retriedWithNewToken) {
                dispatch(setLogout());
                originalAction = null;
                throw new BaseError("The authorization has expired. ", 403);
            }

            try {
                // renew token
                if (!token) {
                    throw new BaseError("Invalid token", 403);
                }
                const response = await refreshTokenAPI(token.refresh);
                const newToken = response.data;
                if (newToken) {
                    dispatch(setToken(newToken));

                    // create a new action
                    const retryAction = {
                        ...originalAction,
                        meta: {
                            ...originalAction.meta,
                            retriedWithNewToken: true, // Устанавливаем флаг, чтобы избежать повторного повтора
                        },
                        headers: {
                            ...originalAction.headers,
                            Authorization: `Bearer ${newToken.access}`, // Обновленный токен
                        },
                    };
                    originalAction = null; // reset the attempt
                    return dispatch(retryAction); // send new action
                }
            } catch (refreshError) {
                dispatch(setLogout());
                throw new BaseError("Something wrong", 403);
            }
        }

        return next(action);
    };
};
