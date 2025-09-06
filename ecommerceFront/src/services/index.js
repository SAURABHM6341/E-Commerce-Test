// Services module exports
export { default as API, authAPI, itemsAPI, cartAPI } from './api.js';
export { default as config } from './config.js';
export { default as environmentManager } from './environment.js';

// Re-export commonly used functions
export const getApiBaseUrl = () => environmentManager.getApiBaseUrl();
export const isDevelopment = () => environmentManager.isDevelopment();
export const isProduction = () => environmentManager.isProduction();
