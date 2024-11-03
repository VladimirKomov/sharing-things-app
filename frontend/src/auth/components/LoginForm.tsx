import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store.ts";
import React, {useEffect, useState} from "react";
import {login, selectError, selectLoading, selectToken} from "../redux/authSlice.ts";
import styles from './LoginForm.module.css';
import {Link, useNavigate} from "react-router-dom"

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const token = useSelector(selectToken);
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loginUser(usernameOrEmail, password);
    }

    const loginUser = (usernameOrEmail: string, password: string) => {
        dispatch(login({usernameOrEmail, password}));
    }

    useEffect(() => {
        if (token && token.access) {
            navigate("/");
        }
    }, [token, navigate]);

    return (
        <form className={styles.form} onSubmit={handleLogin}>
            <div>
                <input
                    className={styles.input}
                    type="text"
                    value={usernameOrEmail}
                    placeholder="username or Email"
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <input
                    className={styles.input}
                    type="password"
                    value={password}
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button className={styles.button} type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
            </button>
            {error && <p className={styles.error}>{error.message}</p>}
            <div className={styles['register-link']}>
                <p>
                    Don't have an account? <br/>
                    <Link to="/register">Register here</Link>
                </p>
            </div>
        </form>
    );
}

export default Login;