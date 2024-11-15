import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import {MAPS_API_KEY} from "../../config.ts";

const MapComponent: React.FC = () => (
    <APIProvider apiKey={MAPS_API_KEY}>
        <Map
            style={{ width: '100%', height: '400px' }}
            defaultCenter={{ lat: 51.505, lng: -0.09 }}
            defaultZoom={10}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
        />
    </APIProvider>
);

export default MapComponent;
