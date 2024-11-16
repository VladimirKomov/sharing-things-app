import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsContextProps';

interface RouteMapProps {
    userCoordinates: { lat: number; lng: number };
    itemCoordinates: { lat: number; lng: number };
}

const RouteMap: React.FC<RouteMapProps> = ({ userCoordinates, itemCoordinates }) => {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const { isLoaded } = useGoogleMaps();
    const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(null);
    const [userPosition, setUserPosition] = useState(userCoordinates);

    useEffect(() => {
        if (isLoaded && typeof google !== 'undefined') {
            setTravelMode(google.maps.TravelMode.DRIVING); // Установить начальное значение после проверки
        }
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded && typeof google !== 'undefined' && userPosition && itemCoordinates && travelMode) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: userPosition,
                    destination: itemCoordinates,
                    travelMode: travelMode,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        }
    }, [isLoaded, userPosition, itemCoordinates, travelMode]);

    const handleTravelModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (typeof google !== 'undefined') {
            setTravelMode(event.target.value as google.maps.TravelMode);
        }
    };

    if (!isLoaded || !travelMode) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <label htmlFor="travelMode">Select travel mode: </label>
            <select id="travelMode" onChange={handleTravelModeChange} value={travelMode}>
                <option value={google.maps.TravelMode.DRIVING}>Driving</option>
                <option value={google.maps.TravelMode.WALKING}>Walking</option>
                <option value={google.maps.TravelMode.BICYCLING}>Bicycling</option>
                <option value={google.maps.TravelMode.TRANSIT}>Transit</option>
            </select>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '500px' }}
                center={userPosition}
                zoom={14}
            >
                <Marker
                    position={userPosition}
                    title="Your Location"
                    draggable={true}
                    onDragEnd={(event) => {
                        if (event.latLng) {
                            setUserPosition({ lat: event.latLng.lat(), lng: event.latLng.lng() });
                        }
                    }}
                />
                <Marker position={itemCoordinates} title="Item Location" />
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </>
    );
};

export default RouteMap;
