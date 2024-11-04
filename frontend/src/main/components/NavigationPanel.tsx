import React from 'react';
import styles from './NavigationPanel.module.css';
import {useDispatch, useSelector} from "react-redux";
import {logout, selectToken, Token} from "../../auth/redux/authSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import {AppDispatch} from "../../common/store.ts";


const NavigationPanel: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const token: Token | null = useSelector(selectToken);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout(token?.refresh));
        navigate("/");
    }

    return (
        <nav className={styles.navigationPanel}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to="/" className={styles.navLink}>Main page</Link>
                </li>
                {token ? (
                    <>
                        <li className={styles.navItem}>
                            <Link to="/dashboard" className={styles.navLink}>Personal account</Link>
                        </li>
                        <li className={styles.navItem}>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                                className={styles.navLink}
                            >
                                Sign out
                            </a>
                        </li>
                    </>
                ) : (
                    <>
                        <li className={styles.navItem}>
                            <Link to="/login" className={styles.navLink}>Sign in</Link>
                        </li>
                        <li className={styles.navItem}>
                        <Link to="/register" className={styles.navLink}>Sign up</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavigationPanel;
