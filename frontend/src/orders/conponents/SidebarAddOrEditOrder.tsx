import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../common/store';
import {
    Button,
    CircularProgress,
    Drawer,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import {
    createOrder,
    fetchOrderById,
    selectOrderError,
    selectOrderLoading,
    selectSelectedOrder,
    updateOrder,
} from '../redux/ordersSlice';
import {Order} from '../../common/models/order.model';

import {Item} from '../../common/models/items.model';
import {fetchItemById, selectSelectedItem} from "../../items/redux/itemsSlice.ts";

interface SidebarOrderProps {
    isOpen: boolean;
    onClose: () => void;
    orderId?: number | null;
}

const SidebarAddOrEditOrder: React.FC<SidebarOrderProps> = ({isOpen, onClose, orderId}) => {
    const dispatch = useDispatch<AppDispatch>();
    const order: Order | null = useSelector(selectSelectedOrder);
    const item: Item | null = useSelector(selectSelectedItem);
    const loading = useSelector(selectOrderLoading);
    const error = useSelector(selectOrderError);

    const [formData, setFormData] = useState({
        itemId: '',
        startDate: '',
        endDate: '',
        totalAmount: '',
    });

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderById(orderId));
        } else {
            setFormData({
                itemId: '',
                startDate: '',
                endDate: '',
                totalAmount: '',
            });
        }
    }, [orderId, dispatch]);

    useEffect(() => {
        if (item) {
            dispatch(fetchItemById(item.id));
        }
    }, [item, dispatch]);

    useEffect(() => {
        if (order && orderId) {
            setFormData({
                itemId: order.item.id.toString() || '',
                startDate: order.start_date || '',
                endDate: order.end_date || '',
                totalAmount: order.total_amount?.toString() || '',
            });
        }
    }, [order, orderId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleItemChange = (e: SelectChangeEvent<string>) => {
        setFormData((prevData) => ({
            ...prevData,
            itemId: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const orderData = {
            itemId: parseInt(formData.itemId, 10),
            start_date: formData.startDate,
            end_date: formData.endDate,
            total_amount: parseFloat(formData.totalAmount),
        };

        if (orderId) {
            await dispatch(updateOrder({id: orderId, data: orderData})).unwrap();
        } else {
            await dispatch(createOrder({data: orderData})).unwrap();
        }
        onClose();
    };

    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <div style={{width: 600, padding: '20px'}}>
                <h2>{orderId ? 'Edit Order' : 'Add New Order'}</h2>
                {loading ? (
                    <CircularProgress/>
                ) : error ? (
                    <div style={{color: 'red', marginBottom: '1em'}}>{error}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Item</InputLabel>
                            <Select
                                label="Item"
                                value={formData.itemId}
                                onChange={handleItemChange}
                                required
                            >
                                {item && (
                                    <option value={item.id}>{item.name}</option>
                                )}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Start Date"
                            type="date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            InputLabelProps={{shrink: true}}
                            required
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            InputLabelProps={{shrink: true}}
                            required
                        />
                        <TextField
                            label="Total Amount"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleChange}
                            required
                            type="number"
                            inputMode="decimal"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{marginTop: '1em'}}
                            disabled={loading}
                        >
                            {orderId ? 'Save' : 'Add Order'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={onClose}
                            style={{marginTop: '1em'}}
                        >
                            Cancel
                        </Button>
                    </form>
                )}
            </div>
        </Drawer>
    );
};

export default SidebarAddOrEditOrder;
