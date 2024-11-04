import {RequestConfig} from "../../common/models/request.model.ts";
import {UserSettings} from "../redux/userSettingsSlice.ts";

const dashboardRoot = 'dashboard/';


export const getItemsUser = (): RequestConfig => {
    return {
        method: 'GET',
        url: dashboardRoot + 'items/',
        headers: {
            'Content-Type': 'application/json',
        },
    };
};

export const getUserSettings = (): RequestConfig => {
    return {
        method: 'GET',
        url: dashboardRoot + 'settings/',
        headers: {
            'Content-Type': 'application/json',
        },
    };
}

export const configUserSettings = (): RequestConfig => {
    return {
        method: 'GET',
        url: dashboardRoot + 'settings/',
    }
};

export const patchUserSettings = (data: UserSettings): RequestConfig => {
    return  {
        method: 'PATCH',
        url: dashboardRoot + 'settings/',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    }
}
