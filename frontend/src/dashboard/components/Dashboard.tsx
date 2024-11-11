import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Personal account</h1>
            <Link to="settings" className={styles.linkButton}>
                Go to Profile Settings
            </Link>
            <Link to="items" className={styles.linkButton}>
                Go Your to Items
            </Link>
            <Link to="orders" className={styles.linkButton}>
                Go Your to Orders
            </Link>

            <div className={styles.outletContainer}>
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;