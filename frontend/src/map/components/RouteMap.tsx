import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsContextProps';

interface RouteMapProps {
    userCoordinates?: { lat: number; lng: number }; // Сделать параметр необязательным
    itemCoordinates: { lat: number; lng: number };
}

const RouteMap: React.FC<RouteMapProps> = ({ userCoordinates, itemCoordinates }) => {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const { isLoaded } = useGoogleMaps();
    const [travelMode, setTravelMode] = useState<google.maps.TravelMode | null>(null);
    const [zoom, setZoom] = useState(14);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect(() => {
        if (isLoaded && typeof google !== 'undefined') {
            setTravelMode(google.maps.TravelMode.DRIVING);
            if (!userCoordinates) {
                setZoom(12);
            }
        }
    }, [isLoaded, userCoordinates]);

    useEffect(() => {
        if (isLoaded && typeof google !== 'undefined' && (userCoordinates || itemCoordinates) && travelMode) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: userCoordinates || itemCoordinates,
                    destination: itemCoordinates || userCoordinates,
                    travelMode: travelMode,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        console.log('Directions:', result);
                        setDirections(result);
                        if (map) {
                            map.setZoom(12);
                        }
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        }
    }, [isLoaded, userCoordinates, itemCoordinates, travelMode, map]);

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
                onLoad={(mapInstance) => setMap(mapInstance)}
            >
                {userCoordinates && <Marker position={userCoordinates} title="Your Location" />}
                <Marker
                    position={itemCoordinates}
                    title="Item Location"
                    animation={google.maps.Animation.BOUNCE}
                />

                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </>
    );
};

export default RouteMap;
