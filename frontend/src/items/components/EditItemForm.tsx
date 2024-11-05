import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../common/store';
import {Button, CircularProgress, TextField} from '@mui/material';
import {fetchUserItemById, selectUserSelectedItem, updateUserItem} from "../../dashboard/redux/userItemsSlice.ts";
import {Item} from "../../common/models/items.model.ts";

const EditItemForm: React.FC = () => {
    const {id} = useParams<{ id: string }>(); // Get item ID from URL
    const dispatch = useDispatch<AppDispatch>();

    let item: Item | null;
    item = useSelector(selectUserSelectedItem);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    // Load item data when component mounts
    useEffect(() => {
        if (id) {
            setLoading(true);
            dispatch(fetchUserItemById(id))
                .unwrap()
                .then(() => setLoading(false))
                .catch(() => setLoading(false));
        }
    }, [id, dispatch]);

    // Set initial values when item data is loaded
    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
            });
        }
    }, [item]);

    const handleClose = () => {
        window.close();
    };

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(updateUserItem({id, data: formData})).unwrap();
            window.close() // Navigate back to the item list after saving
        } catch (error) {
            console.error("Error updating item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: 500, margin: 'auto'}}>
            <h2>Edit Item</h2>
            {loading ? (
                <CircularProgress/>
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
                        rows={4}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{marginTop: '1em'}}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={handleClose}
                        style={{marginTop: '1em'}}
                    >
                        Cancel
                    </Button>
                </form>
            )}
        </div>
    );
};

export default EditItemForm;
