import {RequestConfig} from "../../common/models/request.model.ts";
import {UserSettings} from "../redux/userSettingsSlice.ts";

const dashboardRoot = 'dashboard/';

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

export const getUserItems = (params?: Record<string, string>): RequestConfig => {
    return {
        method: 'GET',
        url: dashboardRoot + 'items/',
        params: params,
    };
};

export const getUserItemById = (id: string): RequestConfig => {
    return {
        method: 'GET',
        url: `${dashboardRoot}items/${id}/`,
    };
};

interface putUserItemData {
    id: string;
    data: FormData;
}

export const putUserItem = (credentials: putUserItemData): RequestConfig => {
    const {id, data} = credentials;
    return {
        method: 'PUT',
        url: `${dashboardRoot}items/${id}/`,
        data: data,
    };
};

export const delUserItem = (id: string): RequestConfig => {
    return {
        method: 'DELETE',
        url: `${dashboardRoot}items/${id}/`,
    };
};
