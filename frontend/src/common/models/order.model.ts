export interface Order {
    id: number;
    itemId: number;
    itemName: string;
    ownerId: number;
    ownerName: string;
    userId: number;
    userName: string;
    status: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
}