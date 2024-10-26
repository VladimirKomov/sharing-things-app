import React from 'react';

interface ItemProps {
    name: string;
    description: string;
    images: string[];
}

const Item: React.FC<ItemProps> = ({ name, description, images }) => {
    return (
        <div>
            <h3>{name}</h3>
            <p>{description}</p>
            <div>
                {images.map((image, index) => (
                    <img key={index} src={image} alt={name} width={100} height={100} />
                ))}
            </div>
        </div>
    );
};

export default Item;