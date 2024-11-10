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
import SidebarAddOrEditItem from '../../dashboard/components/SidebarAddOrEditItem.tsx';
import {FixedSizeList as VirtualizedList} from 'react-window';
import AddIcon from '@mui/icons-material/Add';
import IconButton from "@mui/material/IconButton";
import SidebarAddOrEditOrder from "../../orders/conponents/SidebarAddOrEditOrder.tsx";
import CombinedFilter from "../../main/components/CombinedFilter.tsx";

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
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    // Edit item sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Order item sidebar
    const [isOrderSidebarOpen, setIsOrderSidebarOpen] = useState(false);

    //Filtering items
    const [filter, setFilter] = useState<{ category: string | null; status: string; startDate: string; endDate: string }>({
        category: null,
        status: '',
        startDate: '',
        endDate: ''
    });

    // Load categories
    useEffect(() => {
        if (categories.length === 0 && !loading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length, loading]);

    // Load items based on current page and selected category
    useEffect(() => {
        if (ownerOnly) {
            dispatch(clearUserItemsPage());
            dispatch(fetchUserItems({
                page: 1,
                limit: 10,
                category: selectedCategory?.slug || null,
                start_date: filter.startDate || null,
                end_date: filter.endDate || null
            }));
        } else {
            dispatch(clearPage());
            dispatch(fetchItems({
                page: 1,
                limit: 10,
                category: selectedCategory?.slug || null,
                start_date: filter.startDate || null,
                end_date: filter.endDate || null
            }));
        }
    }, [dispatch, ownerOnly, selectedCategory, filter]);

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

    const handleAddNewItem = () => {
        setIsSidebarOpen(true);
        setSelectedItemId(null);
    };

    // Open sidebar for ordering item
    const handleOpenOrderSidebar = (itemId: number) => {
        setSelectedItemId(itemId);
        setIsOrderSidebarOpen(true);
    };

    const handleCloseOrderSidebar = () => {
        setIsOrderSidebarOpen(false);
        setSelectedItemId(null);
    };

    // Filter items
    const handleFilterChange = (category: string | null, status: string, startDate: string, endDate: string) => {
        setFilter({ category, status, startDate, endDate });
    };

    return (
        <div className={styles.itemsListContainer}>
            <CombinedFilter
                onFilter={handleFilterChange}
                showCategoryFilter={true}
                showDateFilter={true}
            />

            <div className={styles.itemsListHeader}>
                {/*<Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>*/}
                {/*    Items list:*/}
                {/*</Typography>*/}
                <h2 className={styles.itemsListTitle}>Items list:</h2>
                {ownerOnly &&
                    <IconButton onClick={handleAddNewItem} color="primary" aria-label="add" size="large">
                        <AddIcon/>
                        New Item
                    </IconButton>
                }
            </div>


            {/* Display error message if any */}
            {error && <p className={styles.errorText}>Error: {error}</p>}

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
                                onOrder={() => handleOpenOrderSidebar(items[index].id)}
                            />
                        </div>
                    )}
                </VirtualizedList>
            </InfiniteScroll>

            {/* Sidebar for editing item */}
            {ownerOnly && (
                <SidebarAddOrEditItem
                    isOpen={isSidebarOpen}
                    onClose={handleCloseSidebar}
                    itemId={selectedItemId}
                />
            )}
            {/* Sidebar for order item */}
            {!ownerOnly && selectedItemId && (
                <SidebarAddOrEditOrder
                    isOpen={isOrderSidebarOpen}
                    onClose={handleCloseOrderSidebar}
                    itemId={selectedItemId}
                />
            )}

        </div>
    );
};

export default ItemsList;
