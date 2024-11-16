import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import {MAPS_API_KEY} from "../../config.ts";


interface GoogleMapsContextProps {
    isLoaded: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextProps | undefined>(undefined);

export const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: MAPS_API_KEY });

    return (
        <GoogleMapsContext.Provider value={{ isLoaded }}>
            {children}
        </GoogleMapsContext.Provider>
    );
};

export const useGoogleMaps = () => {
    const context = useContext(GoogleMapsContext);
    if (!context) {
        throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
    }
    return context;
};
