import React from 'react';
import { useSelector } from 'react-redux';
import { selectOrderById } from "../redux/ordersSlice";
import { RootState } from "../../common/store";
import { Card, CardContent, Typography, Box } from '@mui/material';

interface OrderComponentProps {
    orderId: number;
}

const OrderComponent: React.FC<OrderComponentProps> = ({ orderId }) => {
    const order = useSelector((state: RootState) => selectOrderById(state, orderId));

    if (!order) {
        return <Typography variant="body1" color="error" sx={{ textAlign: 'center' }}>Order not found</Typography>;
    }

    return (
        <Card sx={{ maxWidth: 400, margin: '20px auto', padding: '0 40px' }}>
            <CardContent>
                <Typography variant="h5" component="div" sx={{ textAlign: 'center' }}>
                    Order №{order.id}
                </Typography>
                <Box mt={2}>
                    <Typography variant="body1"><strong>Item: </strong> {order.itemName}</Typography>
                    <Typography variant="body1"><strong>Owner:</strong> {order.ownerName}</Typography>
                    <Typography variant="body1"><strong>Status:</strong> {order.status}</Typography>
                    <Typography variant="body1"><strong>Start Date:</strong> {order.startDate}</Typography>
                    <Typography variant="body1"><strong>End Date:</strong> {order.endDate}</Typography>
                    <Typography variant="body1"><strong>Total Amount:</strong> {order.totalAmount}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default OrderComponent;
