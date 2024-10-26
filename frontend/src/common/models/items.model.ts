export interface Item {
    id: number;
    name: string;
    description: string;
    categoryName: string;
    ownerName: string;
    imagesUrl: [
        {
            url: string;
        }
    ];
}