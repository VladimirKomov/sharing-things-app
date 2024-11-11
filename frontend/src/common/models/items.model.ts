export interface Item {
    id: number;
    name: string;
    description: string;
    categoryName: string;
    ownerName: string;
    ownerAddress: string;
    pricePerDay: number;
    imagesUrl: [
        {
            url: string;
        }
    ];
}