import React from "react";
import CategoryFilter from "../../items/components/CategoryFilter.tsx";
import ItemsList from "../../items/components/ItemsList.tsx";

const MainPage: React.FC = () => {
    return (
        <div>
            <CategoryFilter/>
            <ItemsList/>
        </div>
    )
}

export default MainPage;