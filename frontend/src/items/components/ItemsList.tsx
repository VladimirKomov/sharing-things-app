import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    fetchItems,
    selectError,
    selectHasNextPage,
    selectHasPreviousPage,
    selectItems,
    selectLoading
} from '../redux/itemsSlice';
import ItemComponent from './ItemComponent';
import {AppDispatch} from "../../store";
import styles from "./ItemsList.module.css";
import {Item} from "../../common/models/items.model.ts";
import {Category} from "../../common/models/category.model.ts";
import {selectSelectedCategory} from "../redux/categorySlice.ts";

const ItemsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Get items, category...
    const items = useSelector(selectItems);
    const selectedCategory: Category | null = useSelector(selectSelectedCategory);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const hasPreviousPage = useSelector(selectHasPreviousPage);
    const hasNextPage = useSelector(selectHasNextPage); // End of list indicator

    // Scroll settings
    const [page, setPage] = useState(1); // Starting page
    const [limit] = useState(10); // Items per page
    const [allItems, setAllItems] = useState<Item[]>([]); // State to store all loaded items
    const observer = useRef<IntersectionObserver | null>(null);

    // Reset state when the selected category changes
    useEffect(() => {
        // Clear all items and reset page
        setAllItems([]);
        setPage(1);
    }, [selectedCategory]);

    // Update allItems with newly loaded items
    useEffect(() => {
        updateItems(items);
    }, [items]);

    // Updating all loaded items
    const updateItems = (newItems: Item[]) => {
        setAllItems((prevItems) => {
            const uniqueItems = newItems.filter(
                (item) => !prevItems.some((prevItem) => prevItem.id === item.id)
            );
            return [...prevItems, ...uniqueItems];
        });
    };

    // Load items based on current page and selected category
    useEffect(() => {
        const fetchAndCheckItems = async () => {
            await dispatch(fetchItems({limit, page, category: selectedCategory?.slug || null}));
        };

        fetchAndCheckItems();
    }, [dispatch, page, limit, selectedCategory]);

    // loading more items when scrolling down
    const lastItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || !hasNextPage) return; // Stop if loading or reached end

            if (observer.current) observer.current.disconnect(); // Clear previous observer

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => prevPage + 1); // Increase page count
                }
            });

            if (node) observer.current.observe(node); // Observe last item
        },
        [loading, hasNextPage]
    );

    // loading previous items when scrolling up
    const firstItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            // Stop if loading, at the beginning, or no previous pages
            if (loading || !hasPreviousPage || page === 1) return;

            if (observer.current) observer.current.disconnect(); // Clear previous observer

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setPage((prevPage) => prevPage - 1); // Decrease page count
                }
            });

            if (node) observer.current.observe(node); // Observe first item
        },
        [loading, hasPreviousPage, page]
    );

    return (
        <div className={styles.itemsListContainer}>
            <h2 className={styles.itemsListTitle}>Items list:</h2>
            {/* Display loading message */}
            {loading && <p className={styles.loadingText}>Loading...</p>}
            {/* Display error message if any */}
            {error.message && <p className={styles.errorText}>Error: {error.message}</p>}
            {/* Display message if no items found */}
            {!loading && allItems.length === 0 && <p className={styles.loadingText}>No items found</p>}

            <div className={styles.itemsContainer}>
                {allItems.map((item, index) => {
                    let refProps = {};
                    if (index === 0 && page !== 1) {
                        refProps = {ref: firstItemRef}; // Attach reference for the first item
                    } else if (index === allItems.length - 1) {
                        refProps = {ref: lastItemRef}; // Attach reference for the last item
                    }

                    return (
                        <div key={item.id} {...refProps}>
                            <ItemComponent item={item}/>
                        </div>
                    );
                })}
            </div>
            {/* Display message if no more items to load */}
            {!hasNextPage && <p className={styles.loadingText}>No more items</p>}
        </div>
    );
};

export default ItemsList;
