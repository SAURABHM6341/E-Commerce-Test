// Environment utilities for secure configuration management
import config from './config.js';

class EnvironmentManager {
  constructor() {
    this.config = config;
  }

  // Get API base URL with validation
  getApiBaseUrl() {
    const url = this.config.API_BASE_URL;
    
    if (!url) {
      throw new Error('API base URL is not configured. Please check your environment variables.');
    }
    
    // Remove trailing slash if present
    return url.replace(/\/$/, '');
  }

  // Get full API endpoint URL
  getApiEndpoint(endpoint = '') {
    const baseUrl = this.getApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  // Check if running in development mode
  isDevelopment() {
    return this.config.IS_DEVELOPMENT;
  }

  // Check if running in production mode
  isProduction() {
    return this.config.IS_PRODUCTION;
  }

  // Get request timeout setting
  getRequestTimeout() {
    return this.config.REQUEST_TIMEOUT;
  }

  // Get retry attempts setting
  getRetryAttempts() {
    return this.config.RETRY_ATTEMPTS;
  }

  // Log configuration in development (for debugging)
  logConfig() {
    if (this.isDevelopment()) {
      console.log('Environment Configuration:', {
        API_BASE_URL: this.getApiBaseUrl(),
        IS_DEVELOPMENT: this.isDevelopment(),
        REQUEST_TIMEOUT: this.getRequestTimeout(),
        RETRY_ATTEMPTS: this.getRetryAttempts(),
      });
    }
  }

  // Validate environment setup
  validateEnvironment() {
    try {
      this.getApiBaseUrl();
      return { valid: true, message: 'Environment configuration is valid' };
    } catch (error) {
      return { valid: false, message: error.message };
    }
  }
}

// Create and export singleton instance
const environmentManager = new EnvironmentManager();

// Log configuration in development
if (environmentManager.isDevelopment()) {
  environmentManager.logConfig();
}

export default environmentManager;
