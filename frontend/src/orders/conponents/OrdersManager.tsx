import React from "react";
import CategoryFilter from "../../items/components/CategoryFilter.tsx";
import OrdersList from "./OrdersList.tsx";
import styles from "./OrdersManager.module.css";

const OrdersManager: React.FC = () => {
    return (
        <div className={styles.container}>
            <CategoryFilter/>
            <OrdersList/>
        </div>
    );
}

export default OrdersManager;