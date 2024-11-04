import React from "react";
import CategoryFilter from "../../items/components/CategoryFilter.tsx";
import ItemsList from "../../items/components/ItemsList.tsx";
import styles from "../../dashboard/components/Dashboard.module.css";

const HomePage: React.FC = () => {

    return (
        <div className={styles.container}>
            <CategoryFilter/>
            <ItemsList/>
        </div>
    )
}

export default HomePage;