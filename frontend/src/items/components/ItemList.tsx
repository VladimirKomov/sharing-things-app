// ItemList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {selectItems, selectLoading, selectError, fetchItems} from '../redux/itemsSlice';
import Item from './Item';
import {AppDispatch} from "../../store.ts";

const ItemList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const items = useSelector(selectItems);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        dispatch(fetchItems);
    }, [dispatch]);

    return (
        <div>
            <h2>Items list:</h2>
            {loading && <p>Load...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <Item
                            name={item.name}
                            description={item.description}
                            images={item.images}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
