import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectItems,
    selectLoading,
    selectError,
    fetchItems,
    selectHasNextPage,
    selectHasPreviousPage
} from '../redux/itemsSlice';
import ItemComponent from './ItemComponent';
import {AppDispatch} from "../../store";
import styles from "./ItemsList.module.css";

const ItemsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const items = useSelector(selectItems);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    // Scroll settings
    const [page, setPage] = useState(1); // Starting page
    const [limit] = useState(5); // Items per page
    const HasPreviousPage = useSelector(selectHasPreviousPage);
    const hasNextPage = useSelector(selectHasNextPage); // End of list indicator
    const observer = useRef<IntersectionObserver | null>(null);

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
            if (loading || !HasPreviousPage || page === 1) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => prevPage - 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, HasPreviousPage, page]
    );

    useEffect(() => {
        const fetchAndCheckItems = async () => {
            await dispatch(fetchItems({limit, page}));
        };

        if (hasNextPage || HasPreviousPage) {
            fetchAndCheckItems();
        }
    }, [dispatch, page, limit, hasNextPage, HasPreviousPage]);

    return (
        <div className={styles.itemsListContainer}>
            <h2 className={styles.itemsListTitle}>Items list:</h2>

            {loading && <p className={styles.loadingText}>Load...</p>}
            {error.message && <p className={styles.errorText}>Error: {error.message}</p>}
            {!loading && items.length === 0 && <p className={styles.loadingText}>No items found</p>}

            <div className={styles.itemsContainer}>
                {items.map((item, index) => {
                    if (index === 0) {
                        return (
                            <div ref={firstItemRef} key={item.id}>
                                <ItemComponent item={item}/>
                            </div>
                        );
                    } else if (index === items.length - 1) {
                        return (
                            <div ref={lastItemRef} key={item.id}>
                                <ItemComponent item={item}/>
                            </div>
                        );
                    } else {
                        return (
                            <div key={item.id}>
                                <ItemComponent item={item}/>
                            </div>
                        );
                    }
                })}
            </div>

            {!hasNextPage && <p className={styles.loadingText}>No more items</p>}
        </div>
    );
};

export default ItemsList;
