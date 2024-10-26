import React from 'react';
import {Item} from "../../common/models/items.model";
import styles from "./ItemComponent.module.css"


interface ItemProps {
   item: Item;
}

const ItemComponent: React.FC<ItemProps> = ({ item }) => {
    return (
        <div className={styles.itemContainer}>
            <h3 className={styles.itemTitle}>{item.name}</h3>
            <p className={styles.itemDescription}>{item.description}</p>
            <p className={styles.itemOwner}>Owner: {item.ownerName}</p>
            <p className={styles.itemCategory}>Category: {item.categoryName}</p>
            <div className={styles.imagesContainer}>
                {item.imagesUrl.slice(0, 1).map((image, index) => (
                    <img
                        key={index}
                        src={image.url}
                        alt="Image item"
                        className={styles.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default ItemComponent;