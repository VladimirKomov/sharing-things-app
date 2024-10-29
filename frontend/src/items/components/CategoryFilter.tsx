import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store.ts";
import { fetchCategories, selectCategories, selectError, selectLoading } from "../redux/categorySlice.ts";
import { useNavigate } from "react-router-dom";
import styles from './CategoryFilter.module.css';

const CategoryFilter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCategoryChange = (slug: string) => {
        setSelectedCategory(slug);
        // Формируем новый путь и выполняем навигацию
        const newPath = slug ? `items/categories/${slug}` : '/categories';
        navigate(newPath);
    };

    return (
        <div className={styles.categoryFilter}>
            <label className={styles.label}>Select category:</label>
            {loading ? (
                <p className={styles.loading}>Loading...</p>
            ) : error.message ? (
                <p className={styles.error}>Error loading categories: {error.message}</p>
            ) : (
                <div className={styles.categoriesContainer}>
                    <button
                        className={`${styles.categoryButton} ${selectedCategory === '' ? styles.selected : ''}`}
                        onClick={() => handleCategoryChange('')}
                    >
                        All categories
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`${styles.categoryButton} ${selectedCategory === category.slug ? styles.selected : ''}`}
                            onClick={() => handleCategoryChange(category.slug)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryFilter;
