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
    const [currentUserCoordinates, setCurrentUserCoordinates] = useState<{ lat: number; lng: number } | null>(userCoordinates || null);
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);

    useEffect(() => {
        if (isLoaded && typeof google !== 'undefined') {
            setTravelMode(google.maps.TravelMode.DRIVING);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // current user coordinates if useCurrentLocation is true or no userCoordinates are provided
                        if (useCurrentLocation || !userCoordinates) {
                            setCurrentUserCoordinates({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            });
                            setZoom(14);
                        } else {
                            setCurrentUserCoordinates(userCoordinates);
                        }
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                        setZoom(14);
                    }
                );
            }
        }
    }, [isLoaded, userCoordinates, useCurrentLocation]);

    useEffect(() => {
        if (isLoaded && typeof google !== 'undefined' && currentUserCoordinates && itemCoordinates && travelMode) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: currentUserCoordinates,
                    destination: itemCoordinates,
                    travelMode: travelMode,
                },
                (result, status) => {
                    // Set directions if the request was successful
                    if (status === google.maps.DirectionsStatus.OK) {
                        console.log('Directions:', result);
                        setDirections(result);
                    } else {
                        console.error(`Error fetching directions: ${status}`);
                    }
                }
            );
        }
    }, [isLoaded, currentUserCoordinates, itemCoordinates, travelMode]);

    const handleTravelModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // Update travel mode based on user selection
        if (typeof google !== 'undefined') {
            setTravelMode(event.target.value as google.maps.TravelMode);
        }
    };

    const handleUseCurrentLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Toggle use of current user location
        setUseCurrentLocation(event.target.checked);
        if (!event.target.checked && userCoordinates) {
            setCurrentUserCoordinates(userCoordinates);
        }
    };

    if (!isLoaded) {
        return <div>Loading Google Maps...</div>;
    }

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label htmlFor="travelMode">Select travel mode: </label>
                <select id="travelMode" onChange={handleTravelModeChange} value={travelMode || ''}>
                    <option value={google.maps.TravelMode.DRIVING}>Driving</option>
                    <option value={google.maps.TravelMode.WALKING}>Walking</option>
                    <option value={google.maps.TravelMode.BICYCLING}>Bicycling</option>
                    <option value={google.maps.TravelMode.TRANSIT}>Transit</option>
                </select>
                <input
                    type="checkbox"
                    id="useCurrentLocation"
                    checked={useCurrentLocation}
                    onChange={handleUseCurrentLocationChange}
                />
                <label htmlFor="useCurrentLocation">Use my current location</label>
            </div>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '500px' }}
                zoom={zoom}
                // map center to current user coordinates or item location
                center={currentUserCoordinates || itemCoordinates}
            >
                <>
                    {currentUserCoordinates && directions ? (
                        // directions if available
                        <DirectionsRenderer directions={directions} />
                    ) : (
                        // Show marker at item location if no directions
                        <Marker position={itemCoordinates} title="Item Location" />
                    )}
                </>
            </GoogleMap>
        </>
    );
};

export default RouteMap;
