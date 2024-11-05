import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchItems,
    fetchItemsUser,
    selectAllItems,
    selectAllItemsHasNextPage,
    selectAllItemsHasPreviousPage,
    selectError,
    selectLoading,
    selectUserItems,
    selectUserItemsHasNextPage,
    selectUserItemsHasPreviousPage
} from '../redux/itemsSlice';
import ItemComponent from './ItemComponent';
import { AppDispatch } from "../../common/store.ts";
import styles from "./ItemsList.module.css";
import { Category } from "../../common/models/category.model.ts";
import {clearSelectedCategory, selectSelectedCategory, setSelectedCategory} from "../redux/categorySlice.ts";
import usePagination from "../hooks/usePagination.ts";
import useInfiniteScroll from "../hooks/useInfiniteScroll.ts";
import { useLocation, useNavigate } from "react-router-dom";

interface ItemsListProps {
    ownerOnly?: boolean;
}

const ItemsList_not_work: React.FC<ItemsListProps> = ({ ownerOnly = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const initialPage = parseInt(query.get('page') || '1');
    const initialCategory = query.get('category') || null;

    const [page, setPage] = useState(initialPage);
    const selectedCategory: Category | null = useSelector(selectSelectedCategory);

    const dispatch = useDispatch<AppDispatch>();

    // Получение данных и состояние пагинации
    const items = useSelector(ownerOnly ? selectUserItems : selectAllItems);
    const hasPreviousPage = useSelector(ownerOnly ? selectUserItemsHasPreviousPage : selectAllItemsHasPreviousPage);
    const hasNextPage = useSelector(ownerOnly ? selectUserItemsHasNextPage : selectAllItemsHasNextPage);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    const { allItems, updateItems, resetPagination, limit } = usePagination({ limit: 10 });

    // useEffect(() => {
    //     console.log("Selected category:", selectedCategory); // Отладка значения
    //     if (selectedCategory) {
    //         const path = `/items/categories/${selectedCategory.slug}?page=${page}`;
    //         navigate(path);
    //     } else {
    //         navigate(`?page=${page}`);
    //     }
    // }, [page, selectedCategory, navigate]);


    const { lastItemRef, firstItemRef } = useInfiniteScroll(
        loading,
        hasNextPage,
        hasPreviousPage,
        () => setPage((prevPage) => prevPage + 1),
        () => setPage((prevPage) => prevPage - 1)
    );

    // Обновление URL при изменении страницы или категории
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        if (selectedCategory) params.set('category', selectedCategory.slug);

        navigate({ search: params.toString() });
    }, [page, selectedCategory, navigate]);

    // Очистка выбранной категории при размонтировании компонента
    useEffect(() => {
        return () => {
            dispatch(clearSelectedCategory());
        };
    }, [dispatch]);

    // Сброс пагинации при изменении категории
    useEffect(() => {
        setPage(1); // Сброс на первую страницу
        resetPagination();
    }, [selectedCategory, resetPagination]);

    // Обновление `allItems` при изменении загруженных данных
    useEffect(() => {
        updateItems(items);
    }, [items, updateItems]);

    // Загрузка элементов на основе текущей страницы и категории
    useEffect(() => {
        const action = ownerOnly
            ? fetchItemsUser({ limit, page, category: selectedCategory?.slug || null })
            : fetchItems({ limit, page, category: selectedCategory?.slug || null });
        dispatch(action);
    }, [dispatch, page, limit, selectedCategory, ownerOnly]);

    return (
        <div className={styles.itemsListContainer}>
            <h2 className={styles.itemsListTitle}>Items list:</h2>
            {/* Отображение сообщения о загрузке */}
            {loading && <p className={styles.loadingText}>Loading...</p>}
            {/* Отображение ошибки, если есть */}
            {error.message && <p className={styles.errorText}>Error: {error.message}</p>}
            {/* Сообщение, если элементы не найдены */}
            {!loading && allItems.length === 0 && <p className={styles.loadingText}>No items found</p>}

            <div className={styles.itemsContainer}>
                {allItems.map((item, index) => {
                    let refProps = {};
                    if (index === 0 && page !== 1) {
                        refProps = { ref: firstItemRef }; // Привязка для первого элемента
                    } else if (index === allItems.length - 1) {
                        refProps = { ref: lastItemRef }; // Привязка для последнего элемента
                    }

                    return (
                        <div key={item.id} {...refProps}>
                            <ItemComponent item={item} />
                        </div>
                    );
                })}
            </div>
            {/* Сообщение, если больше нет элементов для загрузки */}
            {!hasNextPage && allItems.length !== 0 && <p className={styles.loadingText}>No more items</p>}
        </div>
    );
};

export default ItemsList_not_work;
