import React, { useState, useEffect } from 'react';
import { IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface ImageUploaderProps {
    currentImages: string[];
    onDeleteImage: (url: string) => void;
    onAddImages: (images: File[]) => void;
    onDeleteNewImage?: (index: number) => void; // Optional callback for deleting new images
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImages, onDeleteImage, onAddImages }) => {
    const [newImages, setNewImages] = useState<File[]>([]);
    const [newImageUrls, setNewImageUrls] = useState<string[]>([]);

    const handleNewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages((prevFiles) => [...prevFiles, ...filesArray]);
            onAddImages(filesArray);
        }
    };

    useEffect(() => {
        const urls = newImages.map((file) => URL.createObjectURL(file));
        setNewImageUrls(urls);

        // Cleanup URL objects on component unmount
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [newImages]);

    const handleDeleteNewImage = (index: number) => {
        setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setNewImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    };

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                Current Images
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {currentImages.map((url, index) => (
                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={url} alt={`Item ${index}`} style={{ width: '150px', height: 'auto', borderRadius: '8px' }} />
                        <IconButton
                            onClick={() => onDeleteImage(url)}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            <DeleteIcon style={{ color: 'red' }} />
                        </IconButton>
                    </div>
                ))}
            </div>

            <Typography variant="h6" gutterBottom>
                New Images
            </Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {newImageUrls.map((url, index) => (
                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={url} alt={`New Item ${index}`} style={{ width: '150px', height: 'auto', borderRadius: '8px' }} />
                        <IconButton
                            onClick={() => handleDeleteNewImage(index)}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            <DeleteIcon style={{ color: 'red' }} />
                        </IconButton>
                    </div>
                ))}
            </div>

            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImagesChange}
                style={{ marginBottom: '10px' }}
            />
        </div>
    );
};

export default ImageUploader;
