import {RequestConfig} from "../../common/models/request.model.ts";

const rootPath = 'ratings/';

export const getItemRatingById = (itemId: number): RequestConfig => {
    return {
        method: 'GET',
        url: `${rootPath}get-rating/${itemId}/`,
    };
}

interface RatingData {
    orderId: number;
    rating: number;
}

export const postItemRating = (data: RatingData): RequestConfig => {
    const {orderId, rating} = data;
    return {
        method: 'POST',
        url: `${rootPath}rate-item/${orderId}/`,
        data: {rating},
    };
}

export const postOwnerRating = (data: RatingData): RequestConfig => {
    const {orderId, rating} = data;
    return {
        method: 'POST',
        url: `${rootPath}rate-owner/${orderId}/`,
        data: {rating},
    };
}