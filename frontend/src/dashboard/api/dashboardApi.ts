import {BaseRequest, RequestConfig} from "../../common/models/request.model.ts";
import createAPIRequest from "../../common/models/api.model.ts";
import {useSelector} from "react-redux";
import {selectTokenAccess} from "../../auth/redux/authSlice.ts";

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
    return response.data;
};