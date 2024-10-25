import React, {useEffect, useState} from "react";
import {Category} from "../../common/models/category.model.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store.ts";
import {fetchCategories} from "../redux/categorySlice.ts";
import styles from './CategoryFilter.module.css';


const CategoryFilter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const categories: Category[] = useSelector((state: RootState) => state.categories.categories);
    const loading = useSelector((state: RootState) => state.categories.loading);
    const error = useSelector((state: RootState) => state.categories.error);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    console.log('categories =>', categories);

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
            ) : error ? (
                <p className={styles.error}>Error loading categories: {error}</p>
            ) : (
                <select
                    className={styles.select}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">Все категории</option>
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