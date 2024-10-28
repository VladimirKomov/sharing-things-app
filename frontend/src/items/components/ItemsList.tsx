import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectItems,
    selectLoading,
    selectError,
    fetchItems,
    selectHasNextPage,
    selectHasPreviousPage
} from '../redux/itemsSlice';
import ItemComponent from './ItemComponent';
import { AppDispatch } from "../../store";
import styles from "./ItemsList.module.css";
import { Item } from "../../common/models/items.model.ts";

const ItemsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const items = useSelector(selectItems);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    // Scroll settings
    const [page, setPage] = useState(1); // Starting page
    const [limit] = useState(10); // Items per page
    const [allItems, setAllItems] = useState<Item[]>([]); // State to store all loaded items
    const hasPreviousPage = useSelector(selectHasPreviousPage);
    const hasNextPage = useSelector(selectHasNextPage); // End of list indicator
    const observer = useRef<IntersectionObserver | null>(null);

    const updateItems = (newItems: Item[]) => {
        setAllItems((prevItems) => {
            const uniqueItems = newItems.filter(
                (item) => !prevItems.some((prevItem) => prevItem.id === item.id)
            );
            return [...prevItems, ...uniqueItems];
        });
    };

    const lastItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || !hasNextPage) return; // Stop if loading or reached end of data

            if (observer.current) observer.current.disconnect(); // Clear observer

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => prevPage + 1); // Increase page count
                }
            });

            if (node) observer.current.observe(node); // Observe last item
        },
        [loading, hasNextPage]
    );

    const firstItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || !hasPreviousPage || page === 1) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => prevPage - 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasPreviousPage, page]
    );

    useEffect(() => {
        const fetchAndCheckItems = async () => {
            await dispatch(fetchItems({ limit, page }));
        };

        if (hasNextPage || hasPreviousPage) {
            fetchAndCheckItems();
        }
    }, [dispatch, page, limit, hasNextPage, hasPreviousPage]);

    // Update allItems with newly loaded items
    useEffect(() => {
        updateItems(items);
    }, [items]);

    return (
        <div className={styles.itemsListContainer}>
            <h2 className={styles.itemsListTitle}>Items list:</h2>

            {loading && <p className={styles.loadingText}>Load...</p>}
            {error.message && <p className={styles.errorText}>Error: {error.message}</p>}
            {!loading && allItems.length === 0 && <p className={styles.loadingText}>No items found</p>}

            <div className={styles.itemsContainer}>
                {allItems.map((item, index) => {
                    let refProps = {};
                    if (index === 0 && page !== 1) {
                        refProps = { ref: firstItemRef };
                    } else if (index === allItems.length - 1) {
                        refProps = { ref: lastItemRef };
                    }

                    return (
                        <div key={item.id} {...refProps}>
                            <ItemComponent item={item} />
                        </div>
                    );
                })}
            </div>

            {!hasNextPage && <p className={styles.loadingText}>No more items</p>}
        </div>
    );
};

export default ItemsList;
