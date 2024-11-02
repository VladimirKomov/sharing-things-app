import { Middleware } from "redux";
import { setAccessToken, setLogout } from "../../auth/redux/authSlice";
import { refreshTokenAPI } from "../../auth/api/authAPI";
import { RootState } from "../../store";

// Middleware для работы с авторизацией и автоматическим обновлением токена
export const tokenMiddleware: Middleware<{}, RootState> = ({ dispatch, getState }) => (next) => async (action: any) => {
    // Проверяем, является ли экшен связанным с асинхронным запросом к API и требует ли он авторизации
    if (action.type.endsWith("/pending") && action.meta?.requiresAuth) {
        console.log("[tokenMiddleware] Обнаружен асинхронный запрос, требующий авторизации:", action.type);

        const state = getState();
        let token = state.auth.token;

        // Проверяем наличие токена
        if (!token) {
            console.warn("[tokenMiddleware] Токен отсутствует. Выполняется логаут.");
            dispatch(setLogout());
            throw new Error("Пожалуйста, авторизуйтесь.");
        }

        // Добавляем токен в заголовок, если он требуется для авторизации, и сохраняем оригинальное действие
        const updatedAction = {
            ...action,
            meta: {
                ...action.meta,
                originalAction: action, // Сохраняем оригинальное действие для повторного использования
                token: token.access, // Добавляем текущий токен
            },
            headers: {
                ...action.headers,
                Authorization: `Bearer ${token.access}`, // Добавляем токен в заголовок
            },
            // body: {
            //     ...action.body,
            //     token: token.access, // Добавляем токен в тело запроса
            // },
        };

        try {
            // Выполняем запрос с текущим токеном
            console.log("[tokenMiddleware] Выполняем запрос с текущим токеном:", updatedAction);
            return await next(updatedAction);
        } catch (error: any) {
            throw error; // Если произошла ошибка при выполнении запроса, передаем её дальше
        }
    }

    // Обрабатываем случаи, когда запрос завершился ошибкой
    if (action.type.endsWith("/rejected")) {
        console.warn("[tokenMiddleware] Запрос завершился ошибкой:", action.payload);

        const state = getState();
        let token = state.auth.token;

        // Проверяем, что ошибка связана с истекшим или невалидным токеном (401 Unauthorized)
        if (token && action.error?.message?.includes("401")) {
            console.log("[tokenMiddleware] Ошибка 401 (Unauthorized). Попытка обновления токена.");

            try {
                // Обновляем токен
                const newToken = await refreshTokenAPI(token.refresh);
                if (newToken) {
                    console.log("[tokenMiddleware] Токен успешно обновлен.");
                    dispatch(setAccessToken(newToken));

                    // Повторяем исходный экшен с обновленным токеном
                    const retryAction = {
                        ...action.meta.originalAction, // Используем сохраненное оригинальное действие
                        meta: {
                            ...action.meta.originalAction.meta,
                            retriedWithNewToken: true, // Указываем, что запрос был повторен с новым токеном
                        },
                    };

                    console.log("[tokenMiddleware] Повторный вызов исходного действия с новым токеном:", retryAction.type);
                    return next(retryAction);
                }
            } catch (refreshError) {
                console.error("[tokenMiddleware] Ошибка при обновлении токена. Выполняется логаут:", refreshError);
                // Ошибка при обновлении токена — делаем logout
                dispatch(setLogout());
                throw new Error("Ошибка при обновлении токена. Пожалуйста, авторизуйтесь.");
            }
        }
    }

    // Передаем действие дальше, если оно не требует специальной обработки
    return next(action);
};

/**
 * Объяснение работы middleware:
 * 1. **Перехват асинхронных запросов**: Middleware перехватывает все экшены, которые заканчиваются на `/pending`, и проверяет, требуется ли авторизация (`requiresAuth`).
 *    - Если токен отсутствует, происходит logout.
 *    - В противном случае, токен добавляется к запросу, и запрос отправляется дальше.
 *
 * 2. **Обработка ошибок (`/rejected`)**: Если запрос завершился ошибкой (`401 Unauthorized`), middleware пытается обновить токен.
 *    - Если обновление прошло успешно, исходное действие (`originalAction`) повторяется с новым токеном.
 *    - Если обновление не удалось, пользователь разлогинивается.
 *
 * 3. **Повторение Запроса**: Для повторного выполнения действия используется сохраненное `originalAction`, которое позволяет повторить запрос с новым токеном, не беспокоя пользователя.
 */
