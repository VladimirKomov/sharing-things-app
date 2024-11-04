import React, {useEffect, useState} from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../common/store.ts';
import {checkToken, selectTokenAccess} from '../redux/authSlice';

interface ProtectedRouteProps {
    redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({redirectPath = '/login'}) => {
    const dispatch = useDispatch<AppDispatch>();
    const tokenAccess: string | undefined = useSelector(selectTokenAccess);
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // Состояние для отслеживания проверки токена

    useEffect(() => {
        const verifyToken = async () => {
            if (tokenAccess) {
                try {
                    // Проверяем, действителен ли токен на сервере
                    await dispatch(checkToken(tokenAccess))
                    setIsTokenValid(true);
                } catch (error: any) {
                    // Если ошибка — токен истек или недействителен
                    setIsTokenValid(false);
                }
            } else {
                // Если токен отсутствует
                setIsTokenValid(false);
            }
        };

        verifyToken();
    }, [tokenAccess]);

    // Пока идет проверка токена, можно показывать индикатор загрузки
    if (isTokenValid === null) {
        return <div>Loading...</div>;
    }

    // Если токен недействителен, перенаправляем на страницу логина
    if (!isTokenValid) {
        return <Navigate to={redirectPath} replace/>;
    }

    // Если токен действителен, продолжаем с показом защищенного контента
    return <Outlet/>;
};

export default ProtectedRoute;
