// Environment configuration
const config = {
  // API Base URL - uses environment variable with fallback
  API_BASE_URL: import.meta.env.VITE_BACKEND || 'http://localhost:5000',
  
  // API Endpoints
  API_ENDPOINTS: {
    AUTH: import.meta.env.VITE_AUTH_ENDPOINT || '/api/auth',
    ITEMS: import.meta.env.VITE_ITEMS_ENDPOINT || '/api/items', 
    CART: import.meta.env.VITE_CART_ENDPOINT || '/api/cart',
  },
  
  // Configuration options with environment variable support
  REQUEST_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000, // 10 seconds
  RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
  
  // Mode detection - uses both Vite's built-in MODE and custom VITE_MODE
  IS_DEVELOPMENT: import.meta.env.MODE === 'development' || import.meta.env.VITE_MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production' || import.meta.env.VITE_MODE === 'production',
  
  // Debug configuration
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true' || import.meta.env.MODE === 'development',
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || (import.meta.env.MODE === 'development' ? 'debug' : 'error'),
};

// Validate required environment variables
const validateConfig = () => {
  const requiredEnvVars = ['VITE_BACKEND'];
  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    if (config.IS_PRODUCTION) {
      console.error('Missing required environment variables:', missingVars);
    } else {
      console.warn('Missing environment variables (using defaults):', missingVars);
    }
  }
  
  // Log configuration in development
  if (config.DEBUG_MODE) {
    console.log('🔧 Environment Configuration:', {
      API_BASE_URL: config.API_BASE_URL,
      MODE: import.meta.env.MODE,
      VITE_MODE: import.meta.env.VITE_MODE,
      IS_DEVELOPMENT: config.IS_DEVELOPMENT,
      IS_PRODUCTION: config.IS_PRODUCTION,
      DEBUG_MODE: config.DEBUG_MODE,
      REQUEST_TIMEOUT: config.REQUEST_TIMEOUT,
      RETRY_ATTEMPTS: config.RETRY_ATTEMPTS,
    });
  }
};

// Run validation
validateConfig();

export default config;
