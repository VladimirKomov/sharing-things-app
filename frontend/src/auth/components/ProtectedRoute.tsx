import React, {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
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
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            if (!loading && token) {
                await dispatch(checkRefreshToken(token));
            }
        };

        if (!loading && token) {
            verifyToken();
        } else if (!token && !loading) {
            navigate(redirectPath, {replace: true});
        }
    }, [token, navigate, dispatch, redirectPath]);

    return <Outlet/>;
};

export default ProtectedRoute;
