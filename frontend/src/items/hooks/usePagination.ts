import {useState} from 'react';
import {Item} from "../../common/models/items.model.ts";


interface PaginationProps {
    initialPage?: number;
    limit?: number;
}

// hook for handling pagination
const usePagination = ({initialPage = 1, limit = 10}: PaginationProps) => {
    const [page, setPage] = useState(initialPage);
    const [allItems, setAllItems] = useState<Item[]>([]);

    // update the list of items
    const updateItems = (newItems: Item[]) => {
        setAllItems((prevItems) => {
            //filter out items that already in the list
            const uniqueItems = newItems.filter(
                (item) => !prevItems.some((prevItem) => prevItem.id === item.id)
            );
            // add unique items
            return [...prevItems, ...uniqueItems];
        });
    };

    // reset paginator
    const resetPagination = () => {
        setAllItems([]);
        setPage(1);
    };

    return {page, setPage, allItems, updateItems, resetPagination, limit};
};

export default usePagination;