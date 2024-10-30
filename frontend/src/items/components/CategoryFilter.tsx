import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../store.ts";
import {
    fetchCategories,
    selectCategories,
    selectError,
    selectLoading,
    selectSelectedCategory,
    setSelectedCategory
} from "../redux/categorySlice.ts";
import styles from './CategoryFilter.module.css';
import {Category} from "../../common/models/category.model.ts";

const CategoryFilter: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Get categories, loading state, and error from the Redux store
    const categories: Category[] = useSelector(selectCategories);
    const selectedCategory: Category | null = useSelector(selectSelectedCategory);
    const loading: boolean = useSelector(selectLoading);
    const error: { message: string | null } = useSelector(selectError);


    // Load categories
    useEffect(() => {
        if (categories.length === 0 && !loading) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories.length, loading]);

    // Handler for changing the selected category
    const handleCategoryChange = (category: Category | null) => {
        if (category !== selectedCategory) {
            dispatch(setSelectedCategory(category));
        }
    };

    // // Handler for changing the selected category
    // const handleCategoryChange = (category: Category | null) => {
    //     if (category !== selectedCategory) {
    //         dispatch(setSelectedCategory(category));
    //         // a new path based on the selected category
    //         const newPath = category ? `/items/categories/${category.slug}` : '/';
    //         navigate(newPath);
    //     }
    // };

    return (
        <div className={styles.categoryFilter}>
            <label className={styles.label}>Select category:</label>
            {loading ? (
                // Display loading state
                <p className={styles.loading}>Loading...</p>
            ) : error.message ? (
                // Display error message
                <p className={styles.error}>Error loading categories: {error.message}</p>
            ) : (
                <div className={styles.categoriesContainer}>
                    {/* Button to select all categories */}
                    <button
                        className={`${styles.categoryButton} ${selectedCategory === null ? styles.selected : ''}`}
                        onClick={() => handleCategoryChange(null)}
                    >
                        All categories
                    </button>
                    {/* Buttons to select specific categories */}
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`${styles.categoryButton} ${selectedCategory?.id === category.id ? styles.selected : ''}`}
                            onClick={() => handleCategoryChange(category)}
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
