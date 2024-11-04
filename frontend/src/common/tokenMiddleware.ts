// import { Middleware } from "redux";
// import { setToken, setLogout } from "../auth/redux/authSlice.ts";
// import { refreshTokenAPI } from "../auth/api/authAPI.ts";
// import { RootState } from "../store.ts";
// import {BaseError} from "./models/error.model.ts";
//
// /**
//  * Explanation of middleware operation:
//  * 1. **Interception of asynchronous requests**: Middleware intercepts all actions that end with `/pending' and checks
//  * whether authorization is required (`requiresAuth').
//  * - If the token is missing, a logout occurs.
//  * - Otherwise, the token is added to the request, and the request is sent further.
//  *
//  * 2. **Error handling (`/rejected')**: If the request failed (`401 Unauthorized`), middleware tries to update the token.
//  * - * - If the update was successful, the original action (`original Action`) is repeated with the new token.
//  * - If the update fails, the user logs out.
//  *
//  * * 3. **Repeating the Request**: To repeat the action, the saved `original Actyon` is used, which allows you
//  * to repeat the request with a new token without disturbing the user.
//  */
//
// export const tokenMiddleware: Middleware<{}, RootState> = ({ dispatch, getState }) => {
//     let originalAction: any = null;
//
//     return (next) => async (action: any) => {
//         const state = getState();
//         const token = state.auth.token;
//
//         // check the action and authorization requirement
//         if (action.type.endsWith("/pending") && action.meta?.requiresAuth) {
//             // check token
//             if (!token) {
//                 // dispatch(setLogout());
//                 throw new BaseError("Invalid token", 403);
//             }
//
//             // save original action for repeat
//             if (!originalAction) {
//                 originalAction = { ...action };
//             }
//
//             // add token
//             const modifiedAction = {
//                 ...action,
//             };
//
//             try {
//                 console.log(
//                     "#tokenMiddleware",
//                     action);
//                 return await next(modifiedAction);
//             } catch (error: any) {
//                 throw new BaseError(error.message, 418);
//             }
//         }
//
//         // handle error 401
//         if (action.type.endsWith("/rejected") && action.payload?.code === 401) {
//             console.log('#action', action);
//             // check count retried
//             if (originalAction?.meta?.retriedWithNewToken) {
//                 // dispatch(setLogout());
//                 originalAction = null;
//                 throw new BaseError("The authorization has expired. ", 403);
//             }
//
//             try {
//                 // renew token
//                 if (!token) {
//                     throw new BaseError("Invalid token", 403);
//                 }
//                 const response = await refreshTokenAPI(token.refresh);
//                 const newToken = response.data;
//                 if (newToken) {
//                     dispatch(setToken(newToken));
//
//                     // create a new action
//                     const retryAction = {
//                         ...originalAction,
//                         meta: {
//                             ...originalAction.meta,
//                             retriedWithNewToken: true, // setting the flag to avoid repeated repetition
//                         },
//                         // headers: {
//                         //     ...originalAction.headers,
//                         //     Authorization: `Bearer ${newToken.access}`, // try with the new token
//                         // },
//                     };
//                     originalAction = null; // reset the attempt
//                     return dispatch(retryAction); // send new action
//                 }
//             } catch (refreshError) {
//                 // dispatch(setLogout());
//                 throw new BaseError("Something wrong", 403);
//             }
//         }
//
//         return next(action);
//     };
// };
//
//
