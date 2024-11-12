import {RequestConfig} from "../../common/models/request.model.ts";


export const getRatingById = (itemId: number): RequestConfig => {
    return {
        method: 'GET',
        url: `/api/ratings/get-rating/${itemId}/`,
    };
}

interface RatingData {
    itemId: number;
    rating: number;
}

export const postRating = (data: RatingData): RequestConfig => {
    const {itemId, rating} = data;
    return {
        method: 'POST',
        url: `/api/ratings/rate-item/${itemId}/`,
        data: {rating},
    };
}