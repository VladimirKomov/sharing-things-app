export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-axmi.onrender.com/api/';
console.log("API_BASE_URL: ", API_BASE_URL);
console.log('process.env', import.meta.env);
//for log
import log from 'loglevel';
log.setLevel('info');

export {log};

