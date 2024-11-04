import CategoryFilter from "../../items/components/CategoryFilter.tsx";
import ItemsList from "../../items/components/ItemsList.tsx";
import React from "react";

const ItemsSetting: React.FC = () => {
    return (
        <div>
            <CategoryFilter/>
            <ItemsList ownerOnly={true}/>
        </div>
    )
}

export default ItemsSetting;