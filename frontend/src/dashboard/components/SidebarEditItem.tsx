import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../common/store.ts';
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
import {fetchCategories, selectCategories} from "../../items/redux/categorySlice.ts";
import {Item} from "../../common/models/items.model.ts";
import {Category} from "../../common/models/category.model.ts";

interface SidebarEditProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: number;
}

const SidebarEditItem: React.FC<SidebarEditProps> = ({isOpen, onClose, itemId}) => {
    const dispatch = useDispatch<AppDispatch>();

    const item: Item | null = useSelector(selectUserSelectedItem);
    const categories: Category[] = useSelector(selectCategories); // Select available categories from Redux
    const loading = useSelector(selectUserItemsLoading);
    const error = useSelector(selectUserItemsError);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        categoryName: '',
    });

    useEffect(() => {
        if (itemId) {
            dispatch(fetchUserItemById(itemId))
        }
    }, [itemId, dispatch]);

    useEffect(() => {
        if (!categories.length) {
            dispatch(fetchCategories()); // Load categories if not loaded
        }
    }, [categories, dispatch]);

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                categoryName: item.categoryName || '',
            });
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle category change by setting categoryName
    const handleCategoryChange = (e: SelectChangeEvent<string>) => {
        const selectedCategoryId = e.target.value as string;
        const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);
        setFormData((prevData) => ({
            ...prevData,
            categoryName: selectedCategory ? selectedCategory.name : '',
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(updateUserItem({id: itemId, data: formData})).unwrap();
        onClose(); // close sidebar
    };

    return (
        <Drawer anchor="right" open={isOpen} onClose={onClose}>
            <div style={{width: 400, padding: '20px'}}>
                <h2>Edit Item</h2>
                {loading ? (
                    <CircularProgress/>
                ) : error.message ? (
                    <div style={{color: 'red', marginBottom: '1em'}}>{error.message}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
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
                                value={categories.find(cat => cat.name === formData.categoryName)?.id || ''}
                                onChange={handleCategoryChange}
                                required
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{marginTop: '1em'}}
                            disabled={loading}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={onClose}
                            style={{marginTop: '1em'}}
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
