import React, { useState, useEffect } from 'react';
import { Rating, Box, Button } from '@mui/material';
import axios from 'axios';

interface RatingItemProps {
    itemId: number;
    userId: string; // ID текущего пользователя, если нужно использовать
}

const RatingItem: React.FC<RatingItemProps> = ({ itemId, userId }) => {
    const [rating, setRating] = useState<number | null>(null);
    const [isRated, setIsRated] = useState(false);

    useEffect(() => {
        // Загрузить текущий рейтинг для вещи, если он существует
        const fetchRating = async () => {
            try {
                const response = await axios.get(`/api/ratings/item/${itemId}/`);
                setRating(response.data.rating || null);
                setIsRated(!!response.data.rating);
            } catch (error) {
                console.error('Error fetching rating:', error);
            }
        };

        fetchRating();
    }, [itemId]);

    const handleSubmitRating = async () => {
        try {
            await axios.post(`/api/ratings/rate-item/${itemId}/`, { rating });
            setIsRated(true);
            alert('Rating submitted successfully!');
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Error submitting rating. Please try again.');
        }
    };

    return (
        <Box>
            <Rating
                name={`item-rating-${itemId}`}
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                precision={0.5}
                disabled={isRated} // Делаем рейтинг недоступным, если он уже выставлен
            />
            {!isRated && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitRating}
                    disabled={rating === null}
                    sx={{ mt: 2 }}
                >
                    Submit Rating
                </Button>
            )}
        </Box>
    );
};

export default RatingItem;
