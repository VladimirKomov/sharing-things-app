import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { AppDispatch } from "../../common/store";
import { useDispatch } from "react-redux";

interface RateProps {
    orderId: number;
    ownerId?: number;
    onRatingSubmitted?: () => void;
    submitRatingAction: (args: { orderId: number; ownerId?: number; rating: number }) => any;
    label: string;
    currentRating?: number | null;
}

const Rate: React.FC<RateProps> = ({ orderId, ownerId, onRatingSubmitted, submitRatingAction, label, currentRating }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [rating, setRating] = useState<number | null>(currentRating ?? 0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // check if rating is exist
    const isRatingFetched = currentRating !== null && currentRating !== undefined;

    const handleRatingChange = (_event: React.SyntheticEvent<Element>, newValue: number | null) => {
        setRating(newValue);
        setError(null);
        setSuccess(null);
    };

    const submitRating = async () => {
        if (!rating) {
            setError("Please select a rating before submitting.");
            return;
        }

        setLoading(true);
        try {
            await dispatch(submitRatingAction({ orderId, ownerId, rating })).unwrap();
            setLoading(false);
            if (onRatingSubmitted) onRatingSubmitted();
            setSuccess("Accepted.");
        } catch (e) {
            setLoading(false);
            setError("Failed. Try again.");
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle1">{isRatingFetched ? label: `Rate this ${label}`}</Typography>
            <Rating
                value={rating}
                onChange={!isRatingFetched ? handleRatingChange : undefined}
                precision={0.5}
                readOnly={isRatingFetched}
            />
            {!success && !isRatingFetched && (
            <IconButton
                color="primary"
                onClick={submitRating}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
            )}
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            {success && <Typography color="success" variant="body2">{success}</Typography>}
        </Box>
    );
};

export default Rate;
