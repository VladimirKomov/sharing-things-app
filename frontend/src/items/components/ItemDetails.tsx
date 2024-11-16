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
import CloseIcon from '@mui/icons-material/Close';
import {Item} from "../../common/models/items.model.ts";
import {selectCurrentUser} from "../../auth/redux/authSlice";
import {CurrentUser} from "../../common/models/auth.model";
import CalendarWithDisabledDates from "../../common/components/CalendarWithDisabledDates.tsx";
import RouteMap from "../../map/components/RouteMap.tsx";
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
                        {currentUser && currentUser.id !== item.owner.id && (
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
                        <Typography variant="subtitle1"><strong>Owner:</strong> {item.owner.name}</Typography>
                        <Typography variant="subtitle1"><strong>Address:</strong> {item.owner.address}</Typography>
                        <Typography variant="subtitle1"><strong>Category:</strong> {item.categoryName}</Typography>
                        <Typography variant="subtitle1"><strong>Price per
                            day:</strong> {item.pricePerDay} thanks</Typography>
                    </Box>
                    <Typography variant="body1" sx={{marginBottom: 1}}>{item.description}</Typography>
                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" sx={{marginRight: 1}}>Average Rating:</Typography>
                        <Rating value={item.averageRating} readOnly precision={0.5} size="large"/>
                    </Box>
                    <ImageList cols={3} gap={6} className={styles.photosContainer}>
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
                    <CalendarWithDisabledDates bookedDates={item.bookedDates}/>

                    {/* Map and rout */}
                    {item.owner.lat && item.owner.lng && (
                        <Box mt={4}>
                            <Typography variant="h6" gutterBottom>Route to Item:</Typography>
                            <RouteMap
                                userCoordinates={currentUser?.lat && currentUser?.lng ? { lat: currentUser.lat, lng: currentUser.lng } : undefined}
                                itemCoordinates={{ lat: item.owner.lat, lng: item.owner.lng }}
                            />
                        </Box>
                    )}

                    {/* Modal window for image */}
                    <Dialog open={!!selectedImage} onClose={closeImage} maxWidth="md">
                        <DialogTitle>
                            Image
                            <IconButton
                                aria-label="close"
                                onClick={closeImage}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon/>
                            </IconButton>
                        </DialogTitle>
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
