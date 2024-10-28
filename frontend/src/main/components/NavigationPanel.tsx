import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavigationPanel.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {logout, selectToken} from '../../auth/redux/authSlice';

const NavigationPanel: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (token && token.refresh) {
            dispatch(logout(token.refresh) as any);
            navigate('/');
        }
    };

    return (
        <nav className={styles.navigationPanel}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to="/" className={styles.navLink}>Main page</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/dashboard" className={styles.navLink}>Personal account</Link>
                </li>
                <li className={styles.navItem}>
                    <button onClick={handleLogout} className={styles.navLink}>Sign out</button>
                </li>
                <li className={styles.navItem}>
                    <Link to="/login" className={styles.navLink}>Sign in</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/register" className={styles.navLink}>Sign up</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavigationPanel;
