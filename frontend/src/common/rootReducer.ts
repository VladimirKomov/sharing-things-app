import {combineReducers} from "redux";
import authReducer from "../auth/redux/authSlice";
import categoryReducer from "../items/redux/categorySlice";
import itemReducer from "../items/redux/itemsSlice";
import userSettingsReduser from "../dashboard/redux/userSettingsSlice";
import {PayloadAction} from "@reduxjs/toolkit";

const appReducer = combineReducers({
    auth: authReducer,
    categories: categoryReducer,
    items: itemReducer,
    userSettings: userSettingsReduser,
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
