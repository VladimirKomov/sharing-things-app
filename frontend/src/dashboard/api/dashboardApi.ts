import {RequestConfig} from "../../common/models/request.model.ts";
import {UserSettings} from "../redux/userSettingsSlice.ts";

const dashboardRoot = 'dashboard/';


export const getItemsUser = (): RequestConfig => {
    return {
        method: 'GET',
        url: dashboardRoot + 'items/',
    };
};

export const getUserSettings = (): RequestConfig => {
    return {
        method: 'GET',
        url: dashboardRoot + 'settings/',
    }
};

export const patchUserSettings = (data: UserSettings): RequestConfig => {
    return  {
        method: 'PATCH',
        url: dashboardRoot + 'settings/',
        data: data,
    }
}
