import React, {useState} from 'react';
import {Box, CircularProgress, Typography} from '@mui/material';
import Rating from '@mui/material/Rating';
import {AppDispatch} from "../../common/store";
import {useDispatch} from "react-redux";
import {submitOwnerRating} from "../redux/ratingsSlice";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

interface RateOwnerProps {
    orderId: number;
    ownerId: number;
    onRatingSubmitted?: () => void;
}

const RateOwner: React.FC<RateOwnerProps> = ({orderId, ownerId, onRatingSubmitted}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [rating, setRating] = useState<number | null>(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleRatingChange = (_event: React.SyntheticEvent<Element>, newValue: number | null) => {
        setRating(newValue);
    };

    const submitRating = async () => {
        if (!rating) {
            setError("Please select a rating before submitting.");
            return;
        }

        setLoading(true);
        try {
            await dispatch(submitOwnerRating({orderId, ownerId, rating})).unwrap();
            setLoading(false);
            if (onRatingSubmitted) onRatingSubmitted();
        } catch (e) {
            setLoading(false);
            setError("Failed to submit rating. Please try again.");
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle1">Rate this item:</Typography>
            <Rating
                value={rating}
                onChange={handleRatingChange}
                precision={0.5}
            />
            <IconButton
                color="primary"
                onClick={submitRating}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24}/> : <SendIcon/>}
            </IconButton>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default RateOwner;
