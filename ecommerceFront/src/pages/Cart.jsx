import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { 
    cart, 
    loading, 
    initialized,
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    fetchCart 
  } = useCart();

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Debug logs
  useEffect(() => {
    console.log('Cart data:', cart);
    console.log('Cart length:', cart.length);
    console.log('Loading state:', loading);
    console.log('Initialized state:', initialized);
  }, [cart, loading, initialized]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      const result = await updateCartItem(itemId, newQuantity);
      if (result.success) {
        // Cart will be automatically updated through context
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to update cart');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setIsUpdating(true);
      try {
        const result = await removeFromCart(itemId);
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Failed to remove item');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      setIsUpdating(true);
      try {
        const result = await clearCart();
        if (result.success) {
          alert(result.message);
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Failed to clear cart');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.item?.price || 0) * item.quantity;
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (loading && !initialized) {
    return (
      <div className="cart-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        {cart.length > 0 && (
          <button 
            className="clear-cart-btn"
            onClick={handleClearCart}
            disabled={isUpdating}
          >
            Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <a href="/products" className="continue-shopping-btn">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((cartItem) => (
              <div key={cartItem._id} className="cart-item">
                <div className="item-image">
                  {cartItem.item?.images && cartItem.item.images[0] ? (
                    <img 
                      src={cartItem.item.images[0]} 
                      alt={cartItem.item.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="image-placeholder" style={{display: (cartItem.item?.images && cartItem.item.images[0]) ? 'none' : 'flex'}}>
                    No Image
                  </div>
                </div>

                <div className="item-details">
                  <h3>{cartItem.item?.name || 'Product'}</h3>
                  <p className="item-description">
                    {cartItem.item?.description || 'No description available'}
                  </p>
                  <div className="item-meta">
                    {cartItem.item?.category && (
                      <span className="item-category">{cartItem.item.category}</span>
                    )}
                    {cartItem.item?.brand && (
                      <span className="item-brand">{cartItem.item.brand}</span>
                    )}
                  </div>
                  <div className="item-price-mobile">
                    {formatPrice(cartItem.item?.price || 0)}
                  </div>
                </div>

                <div className="item-actions">
                  <div className="item-price-desktop">
                    {formatPrice(cartItem.item?.price || 0)}
                  </div>

                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity - 1)}
                      disabled={cartItem.quantity <= 1 || isUpdating}
                    >
                      -
                    </button>
                    <span className="quantity">{cartItem.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity + 1)}
                      disabled={isUpdating}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    {formatPrice((cartItem.item?.price || 0) * cartItem.quantity)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(cartItem.item._id)}
                    disabled={isUpdating}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({cart.length})</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              <button className="checkout-btn" disabled={isUpdating}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
