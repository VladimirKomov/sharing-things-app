import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import styles from './ItemDetail.module.css';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../common/store.ts";
import {fetchItemById, selectError, selectLoading, selectSelectedItem} from "../redux/itemsSlice.ts";


const ItemDetails: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { itemId } = useParams<{ itemId: string }>();
    const item = useSelector(selectSelectedItem);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchItemById(itemId));
    }, [itemId]);

    const openImage = (url: string) => {
        setSelectedImage(url);
    }

    const closeImage = () => {
        setSelectedImage(null);
    };


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error.message) {
        return <p>{error.message}</p>;
    }

    return (
        <div className={styles.container}>
            {item && (
                <>
                    <h1 className={styles.title}>{item.name}</h1>
                    <div className={styles.infoContainer}>
                        <p className={styles.ownerName}>Owner: {item.ownerName}</p>
                        <p className={styles.category}>Category: {item.categoryName}</p>
                    </div>
                    <p className={styles.description}>{item.description}</p>
                    <div className={styles.photosContainer}>
                        {item.imagesUrl.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={`Photo ${index + 1}`}
                                className={styles.photo}
                                onClick={() => openImage(image.url)} // Открываем модальное окно
                            />
                        ))}
                    </div>

                    {/* modal window for image */}
                    {selectedImage && (
                        <div className={styles.modal} onClick={closeImage}>
                            <img src={selectedImage} alt="Enlarged view" className={styles.modalImage} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ItemDetails;
