import React, {useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store";
import {checkToken, selectToken} from "../redux/authSlice";

interface ProtectedRouteProps {
    redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({redirectPath = '/login'}) => {
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector(selectToken);
    const navigate = useNavigate();

    console.log('token: ', token);

    useEffect(() => {
        // check token
        const verifyToken = async () => {
            dispatch(checkToken(token));
        };

        if (token) {
            verifyToken();
        } else {
            navigate(redirectPath, {replace: true});
        }
    }, [token, navigate, redirectPath, dispatch]);

    return <Outlet/>;
};

export default ProtectedRoute;
