import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../common/store';
import {
    fetchCategories,
    selectCategories,
    selectSelectedCategory,
    setSelectedCategory
} from '../../items/redux/categorySlice';
import {ORDER_STATUSES, OrderStatusKey} from '../../common/models/order.model';
import {Box, Button, MenuItem, TextField} from '@mui/material';


interface CombinedFilterProps {
    onFilter: (category: string | null, status: OrderStatusKey, startDate: string, endDate: string) => void;
    showCategoryFilter?: boolean;
    showStatusFilter?: boolean;
    showDateFilter?: boolean;
}

const CombinedFilter: React.FC<CombinedFilterProps> = ({
                                                           onFilter,
                                                           showCategoryFilter = false,
                                                           showStatusFilter = false,
                                                           showDateFilter = false
                                                       }) => {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector(selectCategories);
    const selectedCategory = useSelector(selectSelectedCategory);

    const [status, setStatus] = useState<OrderStatusKey>(ORDER_STATUSES.ALL.key);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        if (showCategoryFilter && categories.length === 0) {
            dispatch(fetchCategories());
        }
    }, [dispatch, showCategoryFilter, categories.length]);

    const handleFilter = () => {
        onFilter(selectedCategory ? selectedCategory.id : null, status, startDate, endDate);
    };

    const handleReset = () => {
        setStatus(ORDER_STATUSES.ALL.key);
        setStartDate('');
        setEndDate('');
        if (showCategoryFilter) {
            dispatch(setSelectedCategory(null));
        }
        onFilter(null, ORDER_STATUSES.ALL.key, '', '');
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} sx={{ margin: '0 auto', width: '80%' }}>
            {showCategoryFilter && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <label style={{ fontWeight: 'bold' }}>Select category:</label>
                    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
                        <Button
                            variant={selectedCategory === null ? 'contained' : 'outlined'}
                            onClick={() => dispatch(setSelectedCategory(null))}
                        >
                            All categories
                        </Button>
                        {categories.map(category => (
                            <Button
                                key={category.id}
                                variant={selectedCategory?.id === category.id ? 'contained' : 'outlined'}
                                onClick={() => dispatch(setSelectedCategory(category))}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}

            {showStatusFilter && (
                <Box display="flex" justifyContent="center">
                    <TextField
                        label="Order Status"
                        select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as OrderStatusKey)}
                        sx={{ width: '200px' }}
                    >
                        {Object.values(ORDER_STATUSES).map((statusOption) => (
                            <MenuItem key={statusOption.key} value={statusOption.key}>
                                {statusOption.displayName}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            )}

            {showDateFilter && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <label style={{ fontWeight: 'bold' }}>Select date:</label>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: '150px' }}
                        />
                        <TextField
                            label="End Date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: '150px' }}
                        />
                    </Box>
                </Box>
            )}


            <Box display="flex" justifyContent="center" gap={2}>
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

export default CombinedFilter;
