import {configureStore} from "@reduxjs/toolkit";
import logger from 'redux-logger';
import authReducer from './auth/redux/authSlice'
import categoryReducer from './items/redux/categorySlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoryReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;