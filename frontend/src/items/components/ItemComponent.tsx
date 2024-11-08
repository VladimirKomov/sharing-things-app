import React from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from "./ItemComponent.module.css";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../common/store.ts";
import {removeUserItem, selectUserItems} from "../../dashboard/redux/userItemsSlice.ts";
import {selectAllItems} from "../redux/itemsSlice.ts";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface ItemProps {
    itemId: number;
    ownerOnly?: boolean;
    onEdit?: () => void;
    onOrder?: () => void;
}

const ItemComponent: React.FC<ItemProps> = ({itemId, ownerOnly = false, onEdit, onOrder}) => {
    const dispatch = useDispatch<AppDispatch>();

    // Select item based on ownerOnly flag
    let item = useSelector((state: RootState) =>
        ownerOnly
            ? selectUserItems(state).find(i => i.id === itemId)
            : selectAllItems(state).find(i => i.id === itemId)
    );

    const handleClick = () => window.open(`/items/${itemId}`, '_blank');

    const handleEdit = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (ownerOnly) {
            if (onEdit) {
                onEdit();
            }
        }
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (ownerOnly && item && window.confirm("Are you sure you want to delete this item?")) {
            dispatch(removeUserItem(item.id));
        }
    };

    const handleOrder = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!ownerOnly) {
            if (onOrder) {
                onOrder();
            }
        }
    };

    if (!item) return null;

    return (
        <div className={styles.itemContainer} onClick={handleClick}>
            <div className={styles.imagesContainer}>
                {item.imagesUrl.slice(0, 1).map((image, index) => (
                    <img key={index} src={image.url} alt="Item image" className={styles.image}/>
                ))}
            </div>
            <div className={styles.textContainer}>
                <h3 className={styles.itemTitle}><span>Name: </span> {item.name}</h3>
                <p className={styles.itemDescription}><span>Description: </span> {item.description}</p>
                <p className={styles.itemOwner}><span>Owner: </span> {item.ownerName}</p>
                <p className={styles.itemOwner}><span>Price per day: </span>
                    {/*{item.pricePerDay === 0.00 ? `$${item.pricePerDay}` : ' Free' }*/}
                    {item.pricePerDay > 0 ? item.pricePerDay : ' Free'}
                </p>
                <p className={styles.itemCategory}><span>Category:</span> {item.categoryName}</p>
            </div>
            {ownerOnly && (
                <div className={styles.buttonContainer}>
                    <IconButton onClick={handleEdit} color="primary" aria-label="edit">
                        <EditIcon fontSize={'large'}/>
                    </IconButton>
                    <IconButton onClick={handleDelete} color="error" aria-label="delete">
                        <DeleteIcon fontSize={'large'}/>
                    </IconButton>
                </div>
            )}
            {!ownerOnly && (
                <div className={styles.buttonContainer}>
                    {/* Button with AddShoppingCartIcon */}
                    <IconButton onClick={handleOrder} color="secondary"
                                aria-label="add order" style={{fontSize: '3rem'}}>
                        <AddShoppingCartIcon style={{fontSize: '3rem'}}/>
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default ItemComponent;
