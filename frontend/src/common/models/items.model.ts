export interface Item {
    id: number;
    name: string;
    description: string;
    categoryName: string;
    ownerName: string;
    ownerId: number;
    ownerAddress: string;
    pricePerDay: number;
    imagesUrl: [
        {
            url: string;
        }
    ];
}