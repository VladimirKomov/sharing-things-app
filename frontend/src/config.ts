export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-axmi.onrender.com/api/';
export const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

//for log
import log from 'loglevel';
log.setLevel('info');

export {log};

