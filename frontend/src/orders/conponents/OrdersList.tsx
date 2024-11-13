import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../common/store';
import {clearOrders, fetchOrders, fetchOwnerOrders} from '../redux/ordersSlice';
import OrderComponent from './OrderComponent';
import {Box, CircularProgress, Typography} from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import {FixedSizeList as VirtualizedList} from 'react-window';
import CombinedFilter from "../../common/components/CombinedFilter.tsx";

interface OrderListProps {
    ownerOnly?: boolean;
}

const OrdersList: React.FC<OrderListProps> = ({ownerOnly = false}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {page, loading, error} = useSelector((state: RootState) => state.orders);

    /// Filtering orders
    const [filter, setFilter] = useState<{
        category: string | null;
        status: string;
        startDate: string;
        endDate: string
    }>({
        category: null,
        status: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
        // Clear the list of orders and load new data when the filter changes
        dispatch(clearOrders());
        if (ownerOnly) {
            dispatch(fetchOwnerOrders(filter));
        } else {
            dispatch(fetchOrders(filter));
        }
    }, [dispatch, filter]);

    const fetchMoreOrders = () => {
        if (page.hasNextPage) {
            dispatch(fetchOrders(filter));
        }
    };

    return (
        <Box sx={{padding: '0px', minWidth: '800px'}}>
            <CombinedFilter
                onFilter={(category, status, startDate, endDate) => setFilter({category, status, startDate, endDate})}
                showCategoryFilter={false}
                showStatusFilter={true}
                showDateFilter={true}
            />
            <Typography variant="h5" gutterBottom sx={{textAlign: 'center', padding: '20px'}}>
                Orders:
            </Typography>
            {loading && <CircularProgress/>}
            {error && <Typography color="error" sx={{textAlign: 'center'}}>{error}</Typography>}
            {page.orders.length === 0 && !loading && !error && (
                <Typography variant="body1" sx={{textAlign: 'center'}}>No orders found.</Typography>
            )}
            <InfiniteScroll
                dataLength={page.orders.length}
                next={fetchMoreOrders}
                hasMore={page.hasNextPage}
                loader={<CircularProgress/>}
                endMessage={<Typography variant="body2" sx={{textAlign: 'center'}}>No more orders to
                    display</Typography>}
            >
                <VirtualizedList
                    height={800}
                    itemCount={page.orders.length}
                    itemSize={350} // Adjust based on the size of each item
                    width="100%"
                >
                    {({index, style}) => (
                        <div style={style} key={page.orders[index].id}>
                            <OrderComponent orderId={page.orders[index].id} ownerOnly={ownerOnly}/>
                        </div>
                    )}
                </VirtualizedList>
            </InfiniteScroll>
        </Box>
    );
};

export default OrdersList;
