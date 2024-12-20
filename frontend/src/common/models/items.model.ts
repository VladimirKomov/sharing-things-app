export interface Item {
    id: number;
    name: string;
    description: string;
    categoryName: string;
    owner: Owner;
    pricePerDay: number;
    averageRating: number;
    bookedDates: [];
    imagesUrl: [
        {
            url: string;
        }
    ];
}

export interface Owner {
    id: number;
    name: string;
    address: string;
    lat: number;
    lng: number;
}
