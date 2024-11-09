import React, { useState } from 'react';
import { TextField, MenuItem, Button, Box } from '@mui/material';
import { ORDER_STATUSES, OrderStatus } from '../../common/models/order.model.ts';

interface OrderFilterProps {
    onFilter: (status: OrderStatus, startDate: string, endDate: string) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilter }) => {
    const [status, setStatus] = useState<OrderStatus>(ORDER_STATUSES.ALL);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleFilter = () => {
        onFilter(status, startDate, endDate);
    };

    const handleReset = () => {
        setStatus(ORDER_STATUSES.ALL);
        setStartDate('');
        setEndDate('');
        onFilter(ORDER_STATUSES.ALL, '', '');
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            sx={{ margin: '20px auto', width: '300px' }}
        >
            <TextField
                label="Order Status"
                select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                fullWidth
            >
                {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
            />

            <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
            />

            <Box display="flex" gap={2}>
                <Button variant="contained" color="primary" onClick={handleFilter}>
                    Apply Filter
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleReset}>
                    Reset
                </Button>
            </Box>
        </Box>
    );
};

export default OrderFilter;
