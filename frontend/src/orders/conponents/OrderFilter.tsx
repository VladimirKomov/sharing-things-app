import React, {useState} from 'react';
import {Box, Button, MenuItem, TextField} from '@mui/material';
import {ORDER_STATUSES, OrderStatusKey} from '../../common/models/order.model.ts';

interface OrderFilterProps {
    onFilter: (status: OrderStatusKey, startDate: string, endDate: string) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({onFilter}) => {
    const [status, setStatus] = useState<OrderStatusKey>(ORDER_STATUSES.ALL.key);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleFilter = () => {
        onFilter(status, startDate, endDate);
    };

    const handleReset = () => {
        setStatus(ORDER_STATUSES.ALL.key);
        setStartDate('');
        setEndDate('');
        onFilter(ORDER_STATUSES.ALL.key, '', '');
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={2}
            sx={{margin: '20px auto', width: '300px'}}
        >
            <TextField
                label="Order Status"
                select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatusKey)}
                fullWidth
            >
                {Object.values(ORDER_STATUSES).map((statusObj) => (
                    <MenuItem key={statusObj.key} value={statusObj.key}>
                        {statusObj.displayName}
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
