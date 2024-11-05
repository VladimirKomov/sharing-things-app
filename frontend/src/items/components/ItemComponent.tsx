import React from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Item} from "../../common/models/items.model";
import styles from "./ItemComponent.module.css"
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../common/store.ts";
import {removeUserItem} from "../../dashboard/redux/userItemsSlice.ts";


interface ItemProps {
    item: Item;
    ownerOnly?: boolean;
}

const ItemComponent: React.FC<ItemProps> = ({item, ownerOnly = false}) => {
    const dispatch = useDispatch<AppDispatch>();


    const handleClick = () => {
        window.open(`/items/${item.id}`, '_blank');
    };

    const handleEdit = (event: React.MouseEvent) => {
        if (ownerOnly) {
            event.stopPropagation();
            window.open(`items/${item.id}/edit`, '_blank');
        }
    };

    // Deleting an element
    const handleDelete = (event: React.MouseEvent) => {
        if (ownerOnly) {
            event.stopPropagation();
            if (window.confirm("Are you sure you want to delete this item?")) {
                dispatch(removeUserItem(item.id));
            }
        }
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
            {ownerOnly && (
                <div className={styles.buttonContainer}>
                    <IconButton onClick={handleEdit} color="primary" aria-label="edit">
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={handleDelete} color="error" aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default ItemComponent;