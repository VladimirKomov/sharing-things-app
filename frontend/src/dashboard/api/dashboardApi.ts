import {BaseRequest, RequestConfig} from "../../common/models/request.model.ts";
import {useSelector} from "react-redux";
import {selectTokenAccess} from "../../auth/redux/authSlice.ts";
import {createAPIRequest} from "../../common/models/api.model.ts";

const dashboardRoot = 'dashboard/';


export const getItemsUser = async (): Promise<any> => {
    const token = useSelector(selectTokenAccess);
    const requestConfig: RequestConfig = {
        method: 'GET',
        url: dashboardRoot + 'items/',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    };
    const request = new BaseRequest(requestConfig);
    const response = await createAPIRequest(request);
    return response;
};
//
// export const getUserSettings = async (token: string): Promise<any> => {
//     const requestConfig: RequestConfig = {
//         method: 'GET',
//         url: dashboardRoot + 'settings/',
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//         },
//     };
//     const request = new BaseRequest(requestConfig);
//     const response = await createAPIRequest(request);
//     return response;
// }
//
// export const updateUserSettings = async (token: string, data: UserSettings): Promise<any> => {
//     const requestConfig: RequestConfig = {
//         method: 'PATCH',
//         url: dashboardRoot + 'settings/',
//         data: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`
//         }
//     }
//     const request = new BaseRequest(requestConfig);
//     const response = await createAPIRequest(request);
//     return response;
// }