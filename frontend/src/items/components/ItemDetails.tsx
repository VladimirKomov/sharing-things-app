import React, {Suspense, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../common/store";
import {fetchItemById, selectError, selectLoading, selectSelectedItem} from "../redux/itemsSlice";
import {
    Box,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    ImageList,
    ImageListItem,
    Rating,
    Typography,
} from '@mui/material';
import styles from './ItemDetail.module.css';
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {Item} from "../../common/models/items.model.ts";
import {selectCurrentUser} from "../../auth/redux/authSlice";
import {CurrentUser} from "../../common/models/auth.model";
// Lazy loading of the SidebarAddOrder component
const SidebarAddOrder = React.lazy(
    () => import('../../orders/conponents/SidebarAddOrder')
);

const ItemDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {itemId} = useParams<{ itemId: string }>();
    const currentUser: CurrentUser | null = useSelector(selectCurrentUser);
    const item: Item | null = useSelector(selectSelectedItem);
    const loading: boolean = useSelector(selectLoading);
    const error: string | null = useSelector(selectError);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isOrderSidebarOpen, setIsOrderSidebarOpen] = useState(false);

    useEffect(() => {
        if (itemId) {
            dispatch(fetchItemById(itemId));
        }
    }, [itemId]);

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
                        {currentUser && currentUser.id !== item.ownerId && (
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
                        <Typography variant="subtitle1" sx={{marginRight: 1}}>Average Rating:</Typography>
                        <Rating value={item.averageRating} readOnly precision={0.5} size="large"/>
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

                    {/*<Box mt={1}>*/}
                    {/*    <Typography variant="h6">Booked Dates:</Typography>*/}
                    {/*    {item.bookedDates.length > 0 ? (*/}
                    {/*        <Box>*/}
                    {/*            {item.bookedDates.map((date, index) => (*/}
                    {/*                <Typography key={index} variant="body2">*/}
                    {/*                    {new Date(date).toLocaleDateString()}*/}
                    {/*                </Typography>*/}
                    {/*            ))}*/}
                    {/*        </Box>*/}
                    {/*    ) : (*/}
                    {/*        <Typography variant="body2">No booked dates available.</Typography>*/}
                    {/*    )}*/}
                    {/*</Box>*/}

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
                        // Suspense component is used to wrap the lazy loaded component
                        <Suspense fallback={<Typography align="center">Loading sidebar...</Typography>}>
                            {isOrderSidebarOpen && (
                                <SidebarAddOrder
                                    isOpen={isOrderSidebarOpen}
                                    onClose={handleCloseOrderSidebar}
                                    itemId={item.id}
                                />
                            )}
                        </Suspense>
                    )}
                </>
            )}
        </Container>
    );
};

export default ItemDetails;
