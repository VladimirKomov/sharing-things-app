import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectItems, selectLoading, selectError, fetchItems} from '../redux/itemsSlice';
import ItemComponent from './ItemComponent';
import {AppDispatch} from "../../store";
import styles from "./ItemsList.module.css"

const ItemsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const items = useSelector(selectItems);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(fetchItems());
    }, [dispatch]);

    return (
        <div className={styles.itemsListContainer}>
            <h2 className={styles.itemsListTitle}>Items list:</h2>

            {loading && <p className={styles.loadingText}>Load...</p>}

            {error.message && <p className={styles.errorText}>Error: {error.message}</p>}

            <div className={styles.itemsContainer}>
                {items.map((item) => (
                    <div key={item.id}>
                        <ItemComponent item={item}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemsList;
