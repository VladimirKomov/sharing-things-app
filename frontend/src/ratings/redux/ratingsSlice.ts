import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {getItemRatingById, postItemRating, postOwnerRating} from "../api/ratingsApi.ts";
import createCommonThunk from "../../common/models/thunk.model.ts";

interface RatingState {
    ratingItem: number | null;
    ratingOwner: number | null;
    loading: boolean;
    error: string | null;
    isRated: boolean;
}

const initialState: RatingState = {
    ratingItem: null,
    ratingOwner: null,
    loading: false,
    error: null,
    isRated: false,
};

// thunk for fetching the rating of an item
export const fetchItemRating = createCommonThunk(
    'rating/fetchRating',
    getItemRatingById
);

// thunk for submitting the rating of an item
export const submitItemRating = createCommonThunk(
    'rating/submitItemRating',
    postItemRating,
    {requiresAuth: true}
);

// thunk for submitting the rating of an owner
export const submitOwnerRating = createCommonThunk(
    'rating/submitOwnerRating',
    postOwnerRating,
    {requiresAuth: true}
);

const ratingsSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        resetRatingState: (state) => {
            state.ratingItem = null;
            state.ratingOwner = null;
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
                state.ratingItem = action.payload;
                state.isRated = action.payload !== null;
            })
            .addCase(fetchItemRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        // Add the submitItemRating cases here
        builder
            .addCase(submitItemRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitItemRating.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.ratingItem = action.payload;
                state.isRated = true;
            })
            .addCase(submitItemRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        // Add the submitOwnerRating cases here
        builder
            .addCase(submitOwnerRating.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitOwnerRating.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.ratingOwner = action.payload;
                state.isRated = true;
            })
            .addCase(submitOwnerRating.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {resetRatingState} = ratingsSlice.actions;

export const selectRatingItem = (state: { rating: RatingState }) => state.rating.ratingItem;
export const selectRatingLoading = (state: { rating: RatingState }) => state.rating.loading;
export const selectRatingError = (state: { rating: RatingState }) => state.rating.error;
export const selectIsRated = (state: { rating: RatingState }) => state.rating.isRated;

export default ratingsSlice.reducer;
