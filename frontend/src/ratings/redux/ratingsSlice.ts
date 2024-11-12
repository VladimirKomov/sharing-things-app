import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getItemRatingById, postItemRating} from "../api/ratingsApi.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";

interface RatingState {
    rating: number | null;
    loading: boolean;
    error: string | null;
    isRated: boolean;
}

const initialState: RatingState = {
    rating: null,
    loading: false,
    error: null,
    isRated: false,
};

// Асинхронный thunk для получения текущего рейтинга
export const fetchItemRating = createCommonThunk(
    'rating/fetchRating',
    getItemRatingById
);


// Асинхронный thunk для отправки нового рейтинга
export const submitItemRating = createCommonThunk(
    'rating/submitRating',
    postItemRating,
    {requiresAuth: true}
);

const ratingsSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        resetRatingState: (state) => {
            state.rating = null;
            state.error = null;
            state.isRated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItemRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItemRating.fulfilled, (state, action: PayloadAction<number | null>) => {
                state.loading = false;
                state.rating = action.payload;
                state.isRated = action.payload !== null;
            })
            .addCase(fetchItemRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
        // Add the submitItemRating cases here
        builder
            .addCase(submitItemRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitItemRating.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.rating = action.payload;
                state.isRated = true;
            })
            .addCase(submitItemRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {resetRatingState} = ratingsSlice.actions;

export const selectRating = (state: { rating: RatingState }) => state.rating.rating;
export const selectRatingLoading = (state: { rating: RatingState }) => state.rating.loading;
export const selectRatingError = (state: { rating: RatingState }) => state.rating.error;
export const selectIsRated = (state: { rating: RatingState }) => state.rating.isRated;

export default ratingsSlice.reducer;
