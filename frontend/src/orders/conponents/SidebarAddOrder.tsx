import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../common/store';
import {Button, CircularProgress, Drawer} from '@mui/material';
import {createOrder, selectOrderError, selectOrderLoading} from '../redux/ordersSlice';
import 'react-datepicker/dist/react-datepicker.css';
import styles from "./SidebarAddOrder.module.css";
import {PostOrderData} from "../api/ordersApi.ts";
import ReactDatePicker from "react-datepicker";
import {fetchItemById, selectSelectedItem} from "../../items/redux/itemsSlice.ts";

interface SidebarOrderProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: number;
}

const SidebarAddOrder: React.FC<SidebarOrderProps> = ({isOpen, onClose, itemId}) => {
    const dispatch = useDispatch<AppDispatch>();
    const item = useSelector(selectSelectedItem);
    const loading = useSelector(selectOrderLoading);
    const error = useSelector(selectOrderError);
    // formData is an object that contains the data of the order to be created
    const [formData, setFormData] = useState<{
        startDate: Date | null;        itemId: number;

        endDate: Date | null;
        totalAmount: number;
    }>({
        itemId: itemId,
        startDate: null,
        endDate: null,
        totalAmount: 0,
    });
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [daysCount, setDaysCount] = useState<number | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [dateError, setDateError] = useState<string | null>(null);

    // Fetch the item data when the sidebar is opened
    useEffect(() => {
        if (!item) {
            dispatch(fetchItemById(itemId));
        }
    }, [isOpen, itemId, dispatch]);

    // Update the disabled dates when the item data is fetched
    useEffect(() => {
        if (item) {
            const dates = (item.bookedDates || []).map(dateString => new Date(dateString));
            setDisabledDates(dates);
            setFormData((prevData) => ({
                ...prevData,
                itemId: item.id,
            }));
        }
    }, [item]);

    // check if the start date and end date are valid
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const setToMidnight = (date: Date) => {
                date.setHours(0, 0, 0, 0);
                return date;
            };

            const start = setToMidnight(new Date(formData.startDate));
            const end = setToMidnight(new Date(formData.endDate));
            const today = setToMidnight(new Date());
            // Check if the start date is greater than the current date
            if (start < today) {
                setDateError('Start date must be greater than the current date.');
                setDaysCount(null);
                setTotalAmount(0);
                return;
            }
            // Check if the end date is greater than the start date
            if (end < start) {
                setDateError('End date must be greater than start date.');
                setDaysCount(null);
                setTotalAmount(0);
                return;
            }
            // Check if the selected date range includes unavailable dates
            let currentDate = new Date(start);
            while (currentDate <= end) {
                if (disabledDates.some(disabledDate =>
                    currentDate.getFullYear() === disabledDate.getFullYear() &&
                    currentDate.getMonth() === disabledDate.getMonth() &&
                    currentDate.getDate() === disabledDate.getDate()
                )) {
                    setDateError('The selected date range includes unavailable dates.');
                    setDaysCount(null);
                    setTotalAmount(0);
                    return;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            setDateError(null);
            // Calculate the number of days between the start date and the end date
            const differenceInTime = end.getTime() - start.getTime();
            const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)) + 1;
            setDaysCount(differenceInDays);

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
    }, [formData.startDate, formData.endDate, item, disabledDates]);

    // handleSubmit is a function that creates an order
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dateError) return;

        if (!formData.startDate || !formData.endDate) {
            setDateError('Please select start and end dates.');
            return;
        }

        const data: PostOrderData = {
            itemId: formData.itemId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            totalAmount: totalAmount,
        };

        await dispatch(createOrder(data)).unwrap();
        handleCloseOrderSidebar();
    };

    const handleCloseOrderSidebar = () => {
        onClose();
    }

    // handleStartDateChange and handleEndDateChange are functions that update the start and end dates of the order
    const handleStartDateChange = (date: Date | null) => {
        setFormData({...formData, startDate: date});
    };

    const handleEndDateChange = (date: Date | null) => {
        setFormData({...formData, endDate: date});
    };

    // Custom input for date picker
    const CustomInput = React.forwardRef<HTMLInputElement>((props, ref) => (
        <input
            ref={ref}
            {...props}
            style={{
                width: '200px',
                padding: '8px',
                marginInlineEnd: '10px',
                fontSize: '18px',
                border: '1px solid #ccc',
                borderRadius: '10px'
            }}
        />
    ));

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={handleCloseOrderSidebar}
        >
            <div style={{width: 600, padding: '20px'}}>
                {item && (
                    <>
                        <h2>Create Order for {item.name} #{itemId}</h2>
                        <p><strong>Description: </strong>{item.description}</p>
                        <p><strong>Category: </strong>{item.categoryName}</p>
                        <p><strong>Owner: </strong>{item.owner.name}</p>
                        <p><strong>Price per Day: </strong>{item.pricePerDay}</p>
                    </>
                )}
                {loading ? (
                    <CircularProgress/>
                ) : error ? (
                    <div style={{color: 'red', marginBottom: '1em'}}>{error}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <ReactDatePicker
                                selected={formData.startDate}
                                onChange={handleStartDateChange}
                                excludeDates={disabledDates}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select a start date"
                                isClearable
                                customInput={<CustomInput/>}
                                dayClassName={(date) => {
                                    // Highlight the unavailable dates in red
                                    const isDisabled = disabledDates.some(
                                        (disabledDate) =>
                                            date.getFullYear() === disabledDate.getFullYear() &&
                                            date.getMonth() === disabledDate.getMonth() &&
                                            date.getDate() === disabledDate.getDate()
                                    );
                                    return isDisabled ? styles.redDay : '';
                                }}
                            />
                            <ReactDatePicker
                                selected={formData.endDate}
                                onChange={handleEndDateChange}
                                excludeDates={disabledDates}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select an end date"
                                isClearable
                                customInput={<CustomInput/>}
                                dayClassName={(date) => {
                                    // Highlight the unavailable dates in red
                                    const isDisabled = disabledDates.some(
                                        (disabledDate) =>
                                            date.getFullYear() === disabledDate.getFullYear() &&
                                            date.getMonth() === disabledDate.getMonth() &&
                                            date.getDate() === disabledDate.getDate()
                                    );
                                    return isDisabled ? styles.redDay : '';
                                }}
                            />
                        </div>
                        {dateError && (
                            <p style={{color: 'red', marginBottom: '1em'}}>{dateError}</p>
                        )}
                        {daysCount !== null && (
                            <p style={{marginBottom: '1em'}}>Total Days: {daysCount}</p>
                        )}
                        <p style={{fontWeight: 'bold', marginBottom: '1em'}}>
                            Total Amount: {totalAmount.toFixed(2)}
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
                            onClick={handleCloseOrderSidebar}
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
