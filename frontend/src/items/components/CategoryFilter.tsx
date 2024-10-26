import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store.ts";
import {fetchCategories, selectCategories, selectError, selectLoading} from "../redux/categorySlice.ts";
import styles from './CategoryFilter.module.css';



const CategoryFilter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
    };

    return (
        <div className={styles.categoryFilter}>
            <label className={styles.label}>Select category:</label>
            {loading ? (
                <p className={styles.loading}>Loading...</p>
            ) : error.message ? (
                <p className={styles.error}>Error loading categories: {error.message}</p>
            ) : (
                <select
                    className={styles.select}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">All categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    )
}

export default CategoryFilter;