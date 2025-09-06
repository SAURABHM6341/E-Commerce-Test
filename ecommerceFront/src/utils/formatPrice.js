/**
 * Format price to Indian Rupees
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '₹0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Format price with custom options
 * @param {number} price - The price to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted price string
 */
export const formatPriceWithOptions = (price, options = {}) => {
  const defaultOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  };
  
  return new Intl.NumberFormat('en-IN', defaultOptions).format(price);
};

export default formatPrice;
