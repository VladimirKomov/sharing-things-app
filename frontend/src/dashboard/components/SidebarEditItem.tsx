import React, {ChangeEvent, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../common/store.ts';
import {
    Button,
    CircularProgress,
    Drawer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import {
    fetchUserItemById,
    selectUserItemsError,
    selectUserItemsLoading,
    selectUserSelectedItem,
    updateUserItem
} from "../redux/userItemsSlice.ts";
import { fetchCategories, selectCategories } from "../../items/redux/categorySlice.ts";
import { Item } from "../../common/models/items.model.ts";
import { Category } from "../../common/models/category.model.ts";

interface SidebarEditProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: number;
}

const SidebarEditItem: React.FC<SidebarEditProps> = ({ isOpen, onClose, itemId }) => {
    const dispatch = useDispatch<AppDispatch>();

    const item: Item | null = useSelector(selectUserSelectedItem);
    const categories: Category[] = useSelector(selectCategories);
    const loading = useSelector(selectUserItemsLoading);
    const error = useSelector(selectUserItemsError);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryId: '',
    });

    // # images
    const [images, setImages] = useState<File[]>([]);

    useEffect(() => {
        if (itemId) {
            dispatch(fetchUserItemById(itemId));
        }
    }, [itemId, dispatch]);

    useEffect(() => {
        if (!categories.length) {
            dispatch(fetchCategories());
        }
    }, [categories, dispatch]);

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                categoryId: categories.find(cat => cat.name === item.categoryName)?.id.toString() || '',
            });
        }
    }, [item, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCategoryChange = (e: SelectChangeEvent<string>) => {
        setFormData((prevData) => ({
            ...prevData,
            categoryId: e.target.value,
        }));
    };

    // # images
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataWithFiles = new FormData();
        formDataWithFiles.append('name', formData.name);
        formDataWithFiles.append('description', formData.description);
        formDataWithFiles.append('category', formData.categoryId);

        images.forEach((image) => {
            formDataWithFiles.append(`images`, image);
        });
        console.log("########## ", formDataWithFiles, " #################");

        await dispatch(updateUserItem({ id: itemId, data: formDataWithFiles }));
        onClose();
    };

    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <div style={{ width: 600, padding: '20px' }}>
                <h2>Edit Item</h2>
                {loading ? (
                    <CircularProgress />
                ) : error.message ? (
                    <div style={{ color: 'red', marginBottom: '1em' }}>{error.message}</div>
                ) : (
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                value={formData.categoryId}
                                onChange={handleCategoryChange}
                                required
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ margin: '20px 0' }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '1em' }}
                            disabled={loading}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={onClose}
                            style={{ marginTop: '1em' }}
                        >
                            Cancel
                        </Button>
                    </form>
                )}
            </div>
        </Drawer>
    );
};

export default SidebarEditItem;
