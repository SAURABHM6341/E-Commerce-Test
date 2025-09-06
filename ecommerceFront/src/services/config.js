// Environment configuration
const config = {
  // API Base URL - uses environment variable with fallback
  API_BASE_URL: import.meta.env.VITE_BACKEND || 'http://localhost:5000',
  
  // API Endpoints
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    ITEMS: '/api/items', 
    CART: '/api/cart',
  },
  
  // Other configuration options
  REQUEST_TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  
  // Development vs Production settings
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
};

// Validate required environment variables
const validateConfig = () => {
  const requiredEnvVars = ['VITE_BACKEND'];
  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0 && config.IS_PRODUCTION) {
    console.warn('Missing required environment variables:', missingVars);
  }
};

// Run validation
validateConfig();

export default config;
