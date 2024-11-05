import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    fetchItems,
    selectError,
    selectAllItemsHasNextPage,
    selectAllItemsHasPreviousPage,
    selectAllItems,
    selectLoading
} from '../redux/itemsSlice';
import ItemComponent from './ItemComponent';
import {AppDispatch} from "../../common/store.ts";
import styles from "./ItemsList.module.css";
import {Category} from "../../common/models/category.model.ts";
import {clearSelectedCategory, selectSelectedCategory} from "../redux/categorySlice.ts";
import usePagination from "../hooks/usePagination.ts";
import useInfiniteScroll from "../hooks/useInfiniteScroll.ts";
import {
    fetchUserItems,
    selectUserItems,
    selectUserItemsHasNextPage,
    selectUserItemsHasPreviousPage
} from "../../dashboard/redux/userItemsSlice.ts";


interface ItemsListProps {
    ownerOnly?: boolean;
}

const ItemsList: React.FC<ItemsListProps> = ({ ownerOnly = false }) => {
    const dispatch = useDispatch<AppDispatch>();

    // Get items, category...
    const items = useSelector(ownerOnly ? selectUserItems : selectAllItems);
    const hasPreviousPage = useSelector(ownerOnly ? selectUserItemsHasPreviousPage : selectAllItemsHasPreviousPage);
    const hasNextPage = useSelector(ownerOnly ? selectUserItemsHasNextPage : selectAllItemsHasNextPage);
    const selectedCategory: Category | null = useSelector(selectSelectedCategory);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);


    const { page, setPage, allItems, updateItems, resetPagination, limit } = usePagination({limit: 10});

    const { lastItemRef, firstItemRef } = useInfiniteScroll(
        loading,
        hasNextPage,
        hasPreviousPage,
        () => setPage((prevPage) => prevPage + 1),
        () => setPage((prevPage) => prevPage - 1)
    );

    // the dropped category when changing the component, take into account when creating routes for categories
    useEffect(() => {
        return () => {
            dispatch(clearSelectedCategory());
        };
    }, [dispatch, location.pathname]);

    // Reset state when the selected category changes
    useEffect(() => {
        // Clear all items and reset page
        resetPagination();
    }, [selectedCategory]);

    // Update allItems with newly loaded items
    useEffect(() => {
        updateItems(items);
    }, [items]);

    // Load items based on current page and selected category
    useEffect(() => {
        if (ownerOnly) {
            dispatch(fetchUserItems({limit, page, category: selectedCategory?.slug || null}));
        } else {
            dispatch(fetchItems({limit, page, category: selectedCategory?.slug || null}));
        }
    }, [dispatch, page, limit, selectedCategory, ownerOnly]);

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
                            <ItemComponent item={item} ownerOnly={ownerOnly}/>
                        </div>
                    );
                })}
            </div>
            {/* Display message if no more items to load */}
            {!hasNextPage && allItems.length !== 0  && <p className={styles.loadingText}>No more items</p>}
        </div>
    );
};

export default ItemsList;
