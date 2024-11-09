import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../common/store';
import { fetchOrders } from '../redux/ordersSlice';
import OrderComponent from './OrderComponent';
import { Typography, Box, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FixedSizeList as VirtualizedList } from 'react-window';

const OrdersList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { page, loading, error } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        if (page.orders.length === 0) {
            dispatch(fetchOrders());
        }
    }, [dispatch, page.orders.length]);

    const fetchMoreOrders = () => {
        if (page.hasNextPage) {
            dispatch(fetchOrders());
        }
    };

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                Orders:
            </Typography>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {page.orders.length === 0 && !loading && !error && (
                <Typography variant="body1">No orders found.</Typography>
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
