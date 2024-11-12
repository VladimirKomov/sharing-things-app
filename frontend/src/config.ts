// export const API_BASE_URL = 'https://backend-axmi.onrender.com/api/';
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

//for log
import log from 'loglevel';
log.setLevel('info');

export {log};

