import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    clearPage,
    fetchItems,
    selectAllItems,
    selectAllItemsCurrentPage,
    selectAllItemsHasNextPage,
    selectError,
    selectLoading,
} from '../redux/itemsSlice';
import ItemComponent from './ItemComponent';
import {AppDispatch} from '../../common/store.ts';
import styles from './ItemsList.module.css';
import {Category} from '../../common/models/category.model.ts';
import {
    fetchCategories,
    selectCategories,
    selectSelectedCategory,
    setSelectedCategory,
} from '../redux/categorySlice.ts';
import {
    clearUserItemsPage,
    fetchUserItems,
    selectUserItems,
    selectUserItemsCurrentPage,
    selectUserItemsError,
    selectUserItemsHasNextPage,
    selectUserItemsLoading,
} from '../../dashboard/redux/userItemsSlice.ts';
import SidebarEditItem from '../../dashboard/components/SidebarEditItem.tsx';
import {FixedSizeList as VirtualizedList} from 'react-window';

interface ItemsListProps {
    ownerOnly?: boolean;
}

const ItemsList: React.FC<ItemsListProps> = ({ownerOnly = false}) => {
    const dispatch = useDispatch<AppDispatch>();

    // Get items, category, etc.
    const items = useSelector(ownerOnly ? selectUserItems : selectAllItems);
    const hasNextPage = useSelector(ownerOnly ? selectUserItemsHasNextPage : selectAllItemsHasNextPage);
    const selectedCategory: Category | null = useSelector(selectSelectedCategory);
    const loading = useSelector(ownerOnly ? selectUserItemsLoading : selectLoading);
    const error = useSelector(ownerOnly ? selectUserItemsError : selectError);
    const currentPage = useSelector(ownerOnly ? selectUserItemsCurrentPage : selectAllItemsCurrentPage);
    const categories = useSelector(selectCategories);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    // Load categories
    useEffect(() => {
        if (categories.length === 0 && !loading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length, loading]);

    // Load items based on current page and selected category
    // Clear items and load items based on current page and selected category
    useEffect(() => {
        if (ownerOnly) {
            dispatch(clearUserItemsPage()); // Clear items when category changes
            dispatch(fetchUserItems({page: 1, limit: 10, category: selectedCategory?.slug || null}));
        } else {
            dispatch(clearPage()); // Clear items when category changes
            dispatch(fetchItems({page: 1, limit: 10, category: selectedCategory?.slug || null}));
        }
    }, [dispatch, ownerOnly, selectedCategory]);

    // Clear selected category when component unmounts
    useEffect(() => {
        return () => {
            dispatch(setSelectedCategory(null));
        };
    }, [dispatch]);

    const loadMoreItems = () => {
        if (hasNextPage) {
            if (ownerOnly) {
                dispatch(fetchUserItems({page: currentPage + 1, limit: 10, category: selectedCategory?.slug || null}));
            } else {
                dispatch(fetchItems({page: currentPage + 1, limit: 10, category: selectedCategory?.slug || null}));
            }
        }
    };

    const handleEditItem = (itemId: number) => {
        if (ownerOnly) {
            setSelectedItemId(itemId);
            setIsSidebarOpen(true);
        }
    };

    const handleCloseSidebar = () => {
        if (ownerOnly) {
            setIsSidebarOpen(false);
            setSelectedItemId(null);
        }
    };

    return (
        <div className={styles.itemsListContainer}>
            <h2 className={styles.itemsListTitle}>Items list:</h2>
            {/* Display error message if any */}
            {error.message && <p className={styles.errorText}>Error: {error.message}</p>}
            {/* Infinite scroll component */}
            <InfiniteScroll
                dataLength={items.length}
                next={loadMoreItems}
                hasMore={hasNextPage}
                loader={<h4 className={styles.loadingText}>Loading...</h4>}
                endMessage={<p className={styles.loadingText}>No more items</p>}
            >
                <VirtualizedList
                    height={1000} // The height of the visible area of the list
                    itemCount={items.length} // The number of items in the list
                    itemSize={300} // The height of one element
                    width={'60vw'}
                >
                    {({index, style}) => (
                        <div key={items[index].id} style={style} className={styles.itemContainer}>
                            <ItemComponent
                                itemId={items[index].id}
                                ownerOnly={ownerOnly}
                                onEdit={() => handleEditItem(items[index].id)}
                            />
                        </div>
                    )}
                </VirtualizedList>
            </InfiniteScroll>

            {/* Sidebar for editing item */}
            {selectedItemId !== null && (
                <SidebarEditItem
                    isOpen={isSidebarOpen}
                    onClose={handleCloseSidebar}
                    itemId={selectedItemId}
                />
            )}
        </div>
    );
};

export default ItemsList;
