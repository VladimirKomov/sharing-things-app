import React, {useEffect, useState} from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "./ItemComponent.module.css"
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../common/store.ts";
import {removeUserItem, selectUserItems} from "../../dashboard/redux/userItemsSlice.ts";
import {selectAllItems} from "../redux/itemsSlice.ts";


interface ItemProps {
    itemId: number;
    ownerOnly?: boolean;
}

const ItemComponent: React.FC<ItemProps> = ({itemId, ownerOnly = false}) => {
    const dispatch = useDispatch<AppDispatch>();

    const reduxItem = ownerOnly
        ? useSelector((state: RootState) => selectUserItems(state).find(i => i.id === itemId))
        : useSelector((state: RootState) => selectAllItems(state).find(i => i.id === itemId));

    const [item, setItem] = useState(reduxItem);

    // Обновление локального состояния при изменении reduxItem
    useEffect(() => {
        setItem(reduxItem);
    }, [reduxItem]); // Здесь мы следим за reduxItem

    if (!item) return 'No item found';

    const handleClick = () => {
        window.open(`/items/${itemId}`, '_blank');
    };

    const handleEdit = (event: React.MouseEvent) => {
        if (ownerOnly) {
            event.stopPropagation();
            window.open(`items/${itemId}/edit`, '_blank');
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