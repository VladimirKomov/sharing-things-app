import React from 'react';
import {Link} from 'react-router-dom';
import styles from './NavigationPanel.module.css';
import Cookies from "js-cookie";

const NavigationPanel: React.FC = () => {

    const accessToken = Cookies.get('access_token');

    return (
        <nav className={styles.navigationPanel}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to="/" className={styles.navLink}>Main page</Link>
                </li>
                {accessToken && (
                    <li className={styles.navItem}>
                        <Link to="/dashboard" className={styles.navLink}>Personal account</Link>
                    </li>
                )}
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