import React from "react";
import OrdersList from "./OrdersList.tsx";
import styles from "./OrdersManager.module.css";

const OrdersManager: React.FC = () => {
    return (
        <div className={styles.container}>
            <OrdersList/>
        </div>
    );
}

export default OrdersManager;