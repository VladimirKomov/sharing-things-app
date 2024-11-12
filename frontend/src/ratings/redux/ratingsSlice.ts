import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getRatingById, postRating} from "../api/ratingsApi.ts";
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
export const fetchRating = createCommonThunk(
    'rating/fetchRating',
    getRatingById
);


// Асинхронный thunk для отправки нового рейтинга
export const submitRating = createCommonThunk(
    'rating/submitRating',
    postRating,
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
            .addCase(fetchRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRating.fulfilled, (state, action: PayloadAction<number | null>) => {
                state.loading = false;
                state.rating = action.payload;
                state.isRated = action.payload !== null;
            })
            .addCase(fetchRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(submitRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitRating.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.rating = action.payload;
                state.isRated = true;
            })
            .addCase(submitRating.rejected, (state, action) => {
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
