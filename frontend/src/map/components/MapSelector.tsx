import React, {useEffect, useState} from 'react';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import {MAPS_API_KEY} from '../../config.ts';

// Default map center (Tel Aviv)
const centerCity = {lat: 32.08, lng: 34.78};

interface MapSelectorProps {
    onLocationSelect: (lat: number, lng: number, address?: string) => void;
    initialLat?: number;
    initialLng?: number;
}

const MapSelector: React.FC<MapSelectorProps> = (
    {onLocationSelect, initialLat, initialLng}
) => {
    const [latitude, setLatitude] = useState<number | undefined>(initialLat);
    const [longitude, setLongitude] = useState<number | undefined>(initialLng);
    const [centerMapByUser, setCenterMapByUser] = useState<{ lat: number, lng: number } | undefined>(
        initialLat && initialLng ? { lat: initialLat, lng: initialLng } : undefined
    );

    useEffect(() => {
        // Set initial location if provided
        if (initialLat && initialLng) {
            setLatitude(initialLat);
            setLongitude(initialLng);
            // Set the map center to the initial location
            setCenterMapByUser({lat: initialLat, lng: initialLng});
        } else {
            // Set default location
            setCenterMapByUser(centerCity);
        }
    }, [initialLat, initialLng]);

    console.log('MapSelector rendering', latitude, longitude, centerMapByUser);

    const handleMapClick = (event: any) => {
        if (event.detail && event.detail.latLng) {
            const lat = event.detail.latLng.lat;
            const lng = event.detail.latLng.lng;
            setLatitude(lat);
            setLongitude(lng);

            // Reverse geocoding to get the address
            if (typeof google !== 'undefined' && google.maps) {
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({location: {lat, lng}}, (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        const formattedAddress = results[0].formatted_address;
                        onLocationSelect(lat, lng, formattedAddress);
                        console.log('Selected address:', formattedAddress);
                    } else {
                        console.error('Geocoder failed due to: ' + status);
                    }
                });
            } else {
                console.error('Google Maps API is not loaded');
            }
        }
    };

    return (
        <APIProvider apiKey={MAPS_API_KEY}>
            <Map
                style={{width: '100%', height: '300px', marginBottom: '5px'}}
                defaultCenter={centerMapByUser || centerCity}
                defaultZoom={14}
                onClick={handleMapClick}
            >
                {latitude && longitude && (
                    <Marker position={{lat: latitude, lng: longitude}}/>
                )}
            </Map>
        </APIProvider>
    );
};

export default MapSelector;
