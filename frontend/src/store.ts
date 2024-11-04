import {configureStore} from "@reduxjs/toolkit";
import logger from 'redux-logger';
import authReducer from './auth/redux/authSlice';
import categoryReducer from './items/redux/categorySlice';
import itemReducer from './items/redux/itemsSlice';
import dashboardReducer from './dashboard/redux/dashboardSlice';
import userSettingsReduser from "./dashboard/redux/userSettingsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        categories: categoryReducer,
        items: itemReducer,
        dashboard: dashboardReducer,
        userSettings: userSettingsReduser,
    },
    middleware: (getDefaultMiddleware): any =>
        getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
