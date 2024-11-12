import {RequestConfig} from "../../common/models/request.model.ts";

const rootPath = 'ratings/';

export const getItemRatingById = (itemId: number): RequestConfig => {
    return {
        method: 'GET',
        url: `${rootPath}get-rating/${itemId}/`,
    };
}

interface RatingData {
    itemId: number;
    rating: number;
}

export const postItemRating = (data: RatingData): RequestConfig => {
    const {itemId, rating} = data;
    return {
        method: 'POST',
        url: `${rootPath}rate-item/${itemId}/`,
        data: {rating},
    };
}