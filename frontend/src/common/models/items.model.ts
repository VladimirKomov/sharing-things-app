export interface Item {
    id: number;
    name: string;
    description: string;
    categoryName: string;
    ownerName: string;
    ownerId: number;
    ownerAddress: string;
    pricePerDay: number;
    averageRating: number;
    bookedDates: [];
    imagesUrl: [
        {
            url: string;
        }
    ];
}