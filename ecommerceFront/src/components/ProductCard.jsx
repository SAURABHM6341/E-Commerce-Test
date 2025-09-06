import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  
  const {
    _id,
    name,
    description,
    price,
    category,
    images,
    brand,
    stock,
    features = []
  } = product;

  // For backward compatibility, also try title and image
  const productName = name || product.title;
  const productImage = images && images[0] ? images[0] : product.image;

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      const result = await addToCart(_id, 1);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to add item to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        {productImage ? (
          <img src={productImage} alt={productName} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            <span>No Image</span>
          </div>
        )}
        {stock === 0 && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
        {category && (
          <div className="category-badge">{category}</div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-title">{productName}</h3>
          {brand && <span className="product-brand">{brand}</span>}
        </div>
        
        <p className="product-description">
          {truncateText(description)}
        </p>
        
        {features.length > 0 && (
          <div className="product-features">
            {features.slice(0, 3).map((feature, index) => (
              <span key={index} className="feature-badge">
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="feature-badge more-features">
                +{features.length - 3} more
              </span>
            )}
          </div>
        )}
        
        <div className="product-footer">
          <div className="price-section">
            <span className="product-price">{formatPrice(price)}</span>
            <span className="stock-info">
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          <div className="product-actions">
            <Link to={`/products/${_id}`} className="view-details-btn">
              View Details
            </Link>
            {stock > 0 && (
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
