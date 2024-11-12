import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import axios from 'axios';

interface RateItemProps {
    itemId: number;
    onRatingSubmitted?: () => void;
}

const RateItem: React.FC<RateItemProps> = ({ itemId, onRatingSubmitted }) => {
    const [rating, setRating] = useState<number | null>(0);
    const [error, setError] = useState<string | null>(null);

    const handleRatingChange = (event: React.SyntheticEvent<Element>, newValue: number | null) => {
        setRating(newValue);
    };

    const submitRating = async () => {
        try {
            await axios.post(`/api/ratings/rate_item/${itemId}/`, { rating });
            alert('Rating submitted successfully');
            if (onRatingSubmitted) onRatingSubmitted();
        } catch (err) {
            console.error('Error submitting rating:', err);
            setError('Failed to submit rating. Please try again later.');
        }
    };

    return (
        <Box>
            <Typography variant="h6">Rate this item:</Typography>
            <Rating
                value={rating}
                onChange={handleRatingChange}
                precision={0.5}
            />
            <Button variant="contained" color="primary" onClick={submitRating} sx={{ marginTop: 2 }}>
                Submit Rating
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default RateItem;
