import {RequestConfig} from "../../common/models/request.model.ts";
import {UserSettings} from "../redux/userSettingsSlice.ts";

export const dashboardRoot = 'dashboard/';

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

interface PostUserItemData {
    data: FormData;
}

export const postUserItem = (credentials: PostUserItemData): RequestConfig => {
    return {
        method: 'POST',
        url: `${dashboardRoot}items/`,
        data: credentials.data,
    };
};

interface PutUserItemData {
    id: string;
    data: FormData;
}

export const putUserItem = (credentials: PutUserItemData): RequestConfig => {
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
