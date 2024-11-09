import React, { useState } from 'react';
import { TextField, MenuItem, Button, Box } from '@mui/material';

interface OrderFilterProps {
    onFilter: (status: string, startDate: string, endDate: string) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onFilter }) => {
    const [status, setStatus] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleFilter = () => {
        onFilter(status, startDate, endDate);
    };

    const handleReset = () => {
        setStatus('');
        setStartDate('');
        setEndDate('');
        onFilter('', '', '');
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
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
            >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">In pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
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
