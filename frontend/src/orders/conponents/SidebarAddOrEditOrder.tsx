import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../common/store';
import {Button, CircularProgress, Drawer, TextField} from '@mui/material';
import {createOrder, selectOrderError, selectOrderLoading} from '../redux/ordersSlice';
import {selectItemById} from "../../items/redux/itemsSlice";

interface SidebarOrderProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: number;
}

const SidebarAddOrder: React.FC<SidebarOrderProps> = ({isOpen, onClose, itemId}) => {
    const dispatch = useDispatch<AppDispatch>();
    const item = useSelector(selectItemById(itemId));
    const loading = useSelector(selectOrderLoading);
    const error = useSelector(selectOrderError);

    const [formData, setFormData] = useState({
        itemId: itemId,
        startDate: '',
        endDate: '',
    });
    const [daysCount, setDaysCount] = useState<number | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [dateError, setDateError] = useState<string | null>(null);

    useEffect(() => {
        if (item) {
            setFormData((prevData) => ({
                ...prevData,
                itemId: itemId,
            }));
        }
    }, [item, itemId]);

    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            // check only days, without hours
            const setToMidnight = (date: Date) => {
                date.setHours(0, 0, 0, 0);
                return date;
            };

            const start = setToMidnight(new Date(formData.startDate));
            const end = setToMidnight(new Date(formData.endDate));
            const today = setToMidnight(new Date());

            // Check that the start date is greater than the current date
            if (start < today) {
                setDateError('Start date must be greater than the current date.');
                setDaysCount(null);
                setTotalAmount(0);
                return;
            }

            // Check that the end date is greater than the start date
            if (end <= start) {
                setDateError('End date must be greater than start date.');
                setDaysCount(null);
                setTotalAmount(0);
                return;
            }

            setDateError(null); // Reset error if everything is correct

            const differenceInTime = end.getTime() - start.getTime();
            const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
            setDaysCount(differenceInDays);

            // Calculate the total amount based on the number of days and the price per day
            if (item && differenceInDays > 0) {
                setTotalAmount(differenceInDays * item.pricePerDay);
            } else {
                setTotalAmount(0);
            }
        } else {
            setDaysCount(null);
            setTotalAmount(0);
            setDateError(null);
        }
    }, [formData.startDate, formData.endDate, item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dateError) return; // Prevent form submission if there is an error

        const orderData = {
            itemId: formData.itemId,
            start_date: formData.startDate,
            end_date: formData.endDate,
            total_amount: totalAmount,
        };

        await dispatch(createOrder({data: orderData})).unwrap();
        onClose();
    };

    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <div style={{width: 600, padding: '20px'}}>
                {item && (
                    <>
                        <h2>Create Order for {item.name} #{itemId}</h2>
                        <p><strong>Description: </strong> {item.description}</p>
                        <p><strong>Category: </strong> {item.categoryName}</p>
                        <p><strong>Owner: </strong> {item.ownerName}</p>
                        <p><strong>Price per Day: </strong> {item.pricePerDay}</p>
                    </>
                )}
                {loading ? (
                    <CircularProgress/>
                ) : error ? (
                    <div style={{color: 'red', marginBottom: '1em'}}>{error}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
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
                        {dateError && (
                            <p style={{color: 'red', marginBottom: '1em'}}>{dateError}</p>
                        )}
                        {daysCount !== null && (
                            <p style={{marginBottom: '1em'}}>Total Days: {daysCount}</p>
                        )}
                        <p style={{fontWeight: 'bold', marginBottom: '1em'}}>
                            Total Amount: {totalAmount.toFixed(2)} thanks(calculated)
                        </p>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{marginTop: '1em'}}
                            disabled={loading || !!dateError || daysCount === null || daysCount <= 0}
                        >
                            Create Order
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

export default SidebarAddOrder;
