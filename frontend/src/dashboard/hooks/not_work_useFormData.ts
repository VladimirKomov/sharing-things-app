import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../common/store.ts';
import {fetchUserItemById, selectUserSelectedItem} from '../redux/userItemsSlice.ts';
import {fetchCategories, selectCategories} from '../../items/redux/categorySlice.ts';
import {Item} from '../../common/models/items.model.ts';
import {Category} from '../../common/models/category.model.ts';
import {SelectChangeEvent} from "@mui/material";

const not_work_useFormData = (itemId: number | null) => {
    const dispatch = useDispatch<AppDispatch>();
    const item: Item | null = useSelector(selectUserSelectedItem);
    const categories: Category[] = useSelector(selectCategories);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
        pricePerDay: ''
    });
    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);

    useEffect(() => {
        if (itemId) {
            dispatch(fetchUserItemById(itemId));
        } else {
            setFormData({
                name: '',
                description: '',
                categoryId: '',
                pricePerDay: ''
            });
            setCurrentImages([]);
            setNewImages([]);
        }
    }, [itemId, dispatch]);

    useEffect(() => {
        if (!categories.length) {
            dispatch(fetchCategories());
        }
    }, [categories, dispatch]);

    useEffect(() => {
        if (item && itemId) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                categoryId: categories.find(cat => cat.name === item.categoryName)?.id.toString() || '',
                pricePerDay: item.pricePerDay?.toString() || ''
            });
            setCurrentImages(item.imagesUrl.map(url => url.url));
        }
    }, [item, categories, itemId]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    const handleCategoryChange = useCallback((e: SelectChangeEvent<string>) => {
        setFormData((prevData) => ({
            ...prevData,
            categoryId: e.target.value,
        }));
    }, []);

    const handleAddImages = useCallback((images: File[]) => {
        setNewImages((prevImages) => [...prevImages, ...images]);
    }, []);

    const handleDeleteCurrentImage = useCallback((url: string) => {
        setCurrentImages((prevImages) => prevImages.filter((image) => image !== url));
    }, []);

    return {
        formData,
        currentImages,
        newImages,
        handleChange,
        handleCategoryChange,
        handleAddImages,
        handleDeleteCurrentImage
    };
};

export default not_work_useFormData;