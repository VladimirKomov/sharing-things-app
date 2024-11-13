import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectOrderById, updateOrderStatus} from "../redux/ordersSlice";
import {RootState} from "../../common/store";
import {Box, Button, Card, CardContent, Typography} from '@mui/material';
import {
    availableStatus,
    getStatusButtonNameByKey,
    getStatusDisplayNameByKey,
    ORDER_STATUSES,
    OrderStatusKey,
    statusTransitions
} from '../../common/models/order.model.ts';
import Rate from "../../ratings/components/Rate.tsx";
import {submitItemRating, submitOwnerRating} from "../../ratings/redux/ratingsSlice.ts";

interface OrderComponentProps {
    orderId: number;
    ownerOnly?: boolean;
}

const OrderComponent: React.FC<OrderComponentProps> = ({orderId, ownerOnly = false}) => {
    const order = useSelector((state: RootState) => selectOrderById(state, orderId));
    const dispatch = useDispatch();
    if (!order) {
        return <Typography variant="body1" color="error" sx={{textAlign: 'center'}}>Order not found</Typography>;
    }

    const handleUpdateStatus = (status: OrderStatusKey) => {
        dispatch(updateOrderStatus({id: order.id, status}));
    };

    return (
        <Card sx={{maxWidth: 450, margin: '20px auto', padding: '0 40px'}}>
            <CardContent>
                <Typography variant="h5" component="div" sx={{textAlign: 'center'}}>
                    Order №{order.id}
                </Typography>
                <Box mt={1}>
                    <Typography variant="body1"><strong>Item: </strong> {order.itemName}</Typography>
                    <Typography variant="body1"><strong>Owner:</strong> {order.ownerName}</Typography>
                    <Typography variant="body1"><strong>Current
                        Status:</strong> {getStatusDisplayNameByKey(order.status)}</Typography>
                    <Typography variant="body1"><strong>Start Date:</strong> {order.startDate}</Typography>
                    <Typography variant="body1"><strong>End Date:</strong> {order.endDate}</Typography>
                    <Typography variant="body1"><strong>Total Amount:</strong> {order.totalAmount}</Typography>
                    <Box mt={1} display="flex" justifyContent="center" gap={2}>
                        {statusTransitions[order.status].map((status) => (
                            availableStatus(ownerOnly, status) && (
                                <Button
                                    key={status}
                                    variant="contained"
                                    color={(status === ORDER_STATUSES.REJECTED.key ||
                                        status === ORDER_STATUSES.CANCELED.key) ? 'error' : 'primary'}
                                    onClick={() => handleUpdateStatus(status)}
                                >
                                    {getStatusButtonNameByKey(status)}
                                </Button>
                            )
                        ))}
                    </Box>
                </Box>
                {order.status === 'completed' && !ownerOnly && (
                    <Box display="flex" flexDirection="column">
                        <Box display="flex" alignItems="center" gap={1}>
                            <Rate
                                orderId={order.id}
                                submitRatingAction={submitItemRating}
                                label=" item:"
                                onRatingSubmitted={() => console.log('Item rating submitted successfully')}
                                currentRating={order.ratingItem}
                            />
                        </Box>
                        <Rate
                            orderId={order.id}
                            ownerId={order.ownerId}
                            submitRatingAction={submitOwnerRating}
                            label=" owner:"
                            onRatingSubmitted={() => console.log('Owner rating submitted successfully')}
                            currentRating={order.ratingOwner}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default OrderComponent;
