import {Item} from "./items.model.ts";

export interface Order {
    id: number;
    item: Item;
    status: string;
    start_date: string;
    end_date: string;
    total_amount: number;
}