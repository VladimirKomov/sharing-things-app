import authReducer from "../auth/redux/authSlice";
import categoryReducer from "../items/redux/categorySlice";
import itemsReducer from "../items/redux/itemsSlice";
import userSettingsReducer from "../dashboard/redux/userSettingsSlice";
import userItemsReducer from "../dashboard/redux/userItemsSlice";
import ordersReducer from "../orders/redux/ordersSlice";
import {combineReducers, PayloadAction} from "@reduxjs/toolkit";

const appReducer = combineReducers({
    auth: authReducer,
    categories: categoryReducer,
    items: itemsReducer,
    userItems: userItemsReducer,
    userSettings: userSettingsReducer,
    orders: ordersReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: PayloadAction<any>): RootState => {
    if (action.type === "auth/logout/pending") {
        console.log(
            "Logout action was dispatched, resetting state to initial state");
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
