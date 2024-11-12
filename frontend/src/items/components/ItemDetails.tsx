import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../common/store";
import {fetchItemById, selectError, selectLoading, selectSelectedItem} from "../redux/itemsSlice";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    ImageList,
    ImageListItem, Rating,
    Typography,
} from '@mui/material';
import styles from './ItemDetail.module.css';
import SidebarAddOrder from "../../orders/conponents/SidebarAddOrder";
import {selectCurrentUserId} from "../../auth/redux/authSlice.ts";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {Item} from "../../common/models/items.model.ts";


const ItemDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {itemId} = useParams<{ itemId: string }>();
    const currentUserId = useSelector(selectCurrentUserId);
    const item: Item | null = useSelector(selectSelectedItem);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isOrderSidebarOpen, setIsOrderSidebarOpen] = useState(false);

    useEffect(() => {
        if (itemId) {
            dispatch(fetchItemById(itemId));
        }
    }, [dispatch, itemId]);

    const openImage = (url: string) => {
        setSelectedImage(url);
    };

    const closeImage = () => {
        setSelectedImage(null);
    };

    const handleOpenOrderSidebar = () => {
        setIsOrderSidebarOpen(true);
    };

    const handleCloseOrderSidebar = () => {
        setIsOrderSidebarOpen(false);
    };

    if (loading) {
        return <Typography variant="h6" align="center">Loading...</Typography>;
    }

    if (error) {
        return <Typography variant="h6" align="center" color="error">{error}</Typography>;
    }

    return (
        <Container maxWidth="md" className={styles.container}>
            {item && (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" gutterBottom>
                            {item.name}
                        </Typography>
                        {currentUserId && currentUserId !== item.ownerId && (
                            <IconButton
                                color="secondary"
                                onClick={handleOpenOrderSidebar}
                                aria-label="add order"
                                style={{fontSize: '3rem'}}>
                                <AddShoppingCartIcon style={{fontSize: '3rem'}}/>
                            </IconButton>
                        )}
                    </Box>
                    <Box mb={2}>
                        <Typography variant="subtitle1"><strong>Owner:</strong> {item.ownerName}</Typography>
                        <Typography variant="subtitle1"><strong>Address:</strong> {item.ownerAddress}</Typography>
                        <Typography variant="subtitle1"><strong>Category:</strong> {item.categoryName}</Typography>
                        <Typography variant="subtitle1"><strong>Price per day:</strong> ${item.pricePerDay}</Typography>
                    </Box>
                    <Typography variant="body1" sx={{marginBottom: 1}}>{item.description}</Typography>
                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" sx={{ marginRight: 1 }}>Average Rating:</Typography>
                        <Rating value={item.averageRating} readOnly precision={0.5} size="large" />
                    </Box>
                    <ImageList cols={3} gap={8} className={styles.photosContainer}>
                        {item.imagesUrl.map((image, index) => (
                            <ImageListItem key={index} onClick={() => openImage(image.url)}>
                                <img
                                    src={image.url}
                                    alt={`Photo ${index + 1}`}
                                    loading="lazy"
                                    style={{cursor: 'pointer'}}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>

                    {/* Button to open the order sidebar */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenOrderSidebar}
                        sx={{marginTop: 2}}
                    >
                        Order Item
                    </Button>

                    {/* Modal window for image */}
                    <Dialog open={!!selectedImage} onClose={closeImage} maxWidth="md">
                        <DialogTitle>Image View</DialogTitle>
                        <DialogContent>
                            {selectedImage && (
                                <img
                                    src={selectedImage}
                                    alt="Enlarged view"
                                    style={{width: '100%', height: 'auto'}}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* Sidebar for ordering item */}
                    {item.id && (
                        <SidebarAddOrder
                            isOpen={isOrderSidebarOpen}
                            onClose={handleCloseOrderSidebar}
                            itemId={item.id}
                        />
                    )}
                </>
            )}
        </Container>
    );
};

export default ItemDetails;
