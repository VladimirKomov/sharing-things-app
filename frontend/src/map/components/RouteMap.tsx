import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsContextProps';

interface RouteMapProps {
    userCoordinates?: { lat: number; lng: number };
    itemCoordinates: { lat: number; lng: number };
}

const RouteMap: React.FC<RouteMapProps> = ({ userCoordinates, itemCoordinates }) => {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const { isLoaded } = useGoogleMaps();
    const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(null);
    const [zoom, setZoom] = useState(14);

    useEffect(() => {
        if (isLoaded && typeof google !== 'undefined') {
            setTravelMode(google.maps.TravelMode.DRIVING);
            if (!userCoordinates) {
                setZoom(14);
            }
        }
    }, [isLoaded, userCoordinates]);

    useEffect(() => {
        if (isLoaded && typeof google !== 'undefined' && userCoordinates && itemCoordinates && travelMode) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: userCoordinates,
                    destination: itemCoordinates,
                    travelMode: travelMode,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        console.log('Directions:', result);
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        }
    }, [isLoaded, userCoordinates, itemCoordinates, travelMode]);

    const handleTravelModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (typeof google !== 'undefined') {
            setTravelMode(event.target.value as google.maps.TravelMode);
        }
    };

    if (!isLoaded) {
        return <div>Loading Google Maps...</div>;
    }

    return (
        <>
            <label htmlFor="travelMode">Select travel mode: </label>
            <select id="travelMode" onChange={handleTravelModeChange} value={travelMode || ''}>
                <option value={google.maps.TravelMode.DRIVING}>Driving</option>
                <option value={google.maps.TravelMode.WALKING}>Walking</option>
                <option value={google.maps.TravelMode.BICYCLING}>Bicycling</option>
                <option value={google.maps.TravelMode.TRANSIT}>Transit</option>
            </select>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '500px' }}
                zoom={zoom}
                center={userCoordinates || itemCoordinates}
            >
                <>
                    {userCoordinates && directions ? (
                        <DirectionsRenderer directions={directions} />
                    ) : (
                        <Marker position={itemCoordinates} title="Item Location" />
                    )}
                </>


            </GoogleMap>
        </>
    );
};

export default RouteMap;
