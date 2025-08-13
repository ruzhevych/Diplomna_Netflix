const REMOTE_BASE_URL: string = import.meta.env.VITE_BASE_URL;
const ACCESS_KEY: string = import.meta.env.VITE_APP_ACCESS_KEY;
const REFRESH_KEY: string = import.meta.env.VITE_APP_REFRESH_KEY;
const CLIENT_ID: string = import.meta.env.VITE_APP_CLIENT_ID;


const APP_ENV = {
    REMOTE_BASE_URL,
    ACCESS_KEY,
    REFRESH_KEY,
    CLIENT_ID
}

console.log('REMOTE_BASE_URL:', REMOTE_BASE_URL);
export { APP_ENV };