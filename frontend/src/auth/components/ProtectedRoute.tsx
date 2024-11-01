import React, {useEffect} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store";
import {checkRefreshToken, selectLoading, selectToken} from "../redux/authSlice";

interface ProtectedRouteProps {
    redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({redirectPath = '/login'}) => {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector(selectToken);
    const loading = useSelector(selectLoading); // Проверяем состояние загрузки

    useEffect(() => {
        const verifyToken = async () => {
            if (!loading && token) {
                await dispatch(checkRefreshToken(token));
            }
        };

        if (token && !loading) {
            verifyToken();
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to={redirectPath} replace/>;
    }

    return <Outlet/>;
};

export default ProtectedRoute;
