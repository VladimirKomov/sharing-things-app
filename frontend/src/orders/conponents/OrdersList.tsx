import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../common/store';
import {clearOrders, fetchOrders} from '../redux/ordersSlice';
import OrderComponent from './OrderComponent';
import OrderFilter from './OrderFilter';
import { Typography, Box, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FixedSizeList as VirtualizedList } from 'react-window';

const OrdersList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { page, loading, error } = useSelector((state: RootState) => state.orders);
    //filtering orders
    const [filter, setFilter] = useState<{ status: string; startDate: string; endDate: string }>({
        status: '',
        startDate: '',
        endDate: '',
    });

    useEffect(() => {
       // Clear the list of orders and load new data when the filter changes
        dispatch(clearOrders());
        dispatch(fetchOrders(filter));
    }, [dispatch, filter]);

    const fetchMoreOrders = () => {
        if (page.hasNextPage) {
            dispatch(fetchOrders(filter));
        }
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                Orders:
            </Typography>
            <OrderFilter onFilter={(status, startDate, endDate) => setFilter({ status, startDate, endDate })} />
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {page.orders.length === 0 && !loading && !error && (
                <Typography variant="body1" sx={{ textAlign: 'center' }}>No orders found.</Typography>
            )}
            <InfiniteScroll
                dataLength={page.orders.length}
                next={fetchMoreOrders}
                hasMore={page.hasNextPage}
                loader={<CircularProgress />}
                endMessage={<Typography variant="body2" sx={{ textAlign: 'center' }}>No more orders to display</Typography>}
            >
                <VirtualizedList
                    height={800}
                    itemCount={page.orders.length}
                    itemSize={150} // Adjust based on the size of each item
                    width="100%"
                >
                    {({ index, style }) => (
                        <div style={style} key={page.orders[index].id}>
                            <OrderComponent orderId={page.orders[index].id} />
                        </div>
                    )}
                </VirtualizedList>
            </InfiniteScroll>
        </Box>
    );
};

export default OrdersList;
