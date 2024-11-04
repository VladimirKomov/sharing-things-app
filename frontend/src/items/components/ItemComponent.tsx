import React from 'react';
import {Item} from "../../common/models/items.model";
import styles from "./ItemComponent.module.css"
import {useNavigate} from "react-router-dom";


interface ItemProps {
    item: Item;
}

const ItemComponent: React.FC<ItemProps> = ({item}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/items/${item.id}`);
    };

    return (
        <div className={styles.itemContainer} onClick={handleClick}>
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
            <div className={styles.textContainer}>
                <h3 className={styles.itemTitle}><span>Name:</span> {item.name}</h3>
                <p className={styles.itemDescription}><span>Description:</span> {item.description}</p>
                <p className={styles.itemOwner}><span>Owner:</span> {item.ownerName}</p>
                <p className={styles.itemCategory}><span>Category:</span> {item.categoryName}</p>
            </div>
        </div>
    );
};

export default ItemComponent;