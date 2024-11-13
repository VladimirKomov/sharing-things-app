import React, {useState} from 'react';
import {Box, CircularProgress, Typography} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Rating from '@mui/material/Rating';
import {AppDispatch} from "../../common/store";
import {useDispatch} from "react-redux";
import {submitItemRating} from "../redux/ratingsSlice";
import IconButton from "@mui/material/IconButton";


interface RateItemProps {
    orderId: number;
    onRatingSubmitted?: () => void;
}

const RateItem: React.FC<RateItemProps> = ({orderId: orderId, onRatingSubmitted}) => {
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
            await dispatch(submitItemRating({orderId, rating})).unwrap();
            setLoading(false);
            if (onRatingSubmitted) onRatingSubmitted();
        } catch (e) {
            setLoading(false);
            setError("Failed to submit rating. Please try again.");
        }
    };

    return (
        <Box>
            {/*<Typography variant="h6">Rate this item:</Typography>*/}
            <Rating
                value={rating}
                onChange={handleRatingChange}
                precision={0.5}
            />
            <IconButton
                color="primary"
                onClick={submitRating}
                sx={{marginTop: 2}}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24}/> : <SendIcon/>}
            </IconButton>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

export default RateItem;
