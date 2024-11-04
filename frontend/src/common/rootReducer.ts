import { combineReducers } from "redux";
import authReducer from "../auth/redux/authSlice";
import categoryReducer from "../items/redux/categorySlice";
import itemReducer from "../items/redux/itemsSlice";
import dashboardReducer from "../dashboard/redux/dashboardSlice";
import userSettingsReduser from "../dashboard/redux/userSettingsSlice";

const appReducer = combineReducers({
    auth: authReducer,
    categories: categoryReducer,
    items: itemReducer,
    dashboard: dashboardReducer,
    userSettings: userSettingsReduser,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: any): RootState => {
    if (action.type === "auth/logout") {
        state = undefined; // Полный сброс состояния
    }
    return appReducer(state, action);
};

export default rootReducer;
