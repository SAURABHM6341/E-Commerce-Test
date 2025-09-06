import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch cart data when component mounts or user logs in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
      fetchCartCount();
    }
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('Fetching cart...');
      const response = await cartAPI.getCart();
      console.log('Cart API response:', response);
      
      if (response.data.success) {
        console.log('Cart data received:', response.data.cart);
        const cartData = response.data.cart;
        
        // Extract items from cart object
        const cartItems = cartData?.items || [];
        console.log('Cart items:', cartItems);
        setCart(cartItems);
      } else {
        console.log('Cart fetch failed:', response.data.message);
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Set empty cart on error so UI doesn't stay in loading state
      setCart([]);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await cartAPI.getCartCount();
      if (response.data.success) {
        setCartCount(response.data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const addToCart = async (itemId, quantity = 1) => {
    try {
      const response = await cartAPI.addToCart({ itemId, quantity });
      if (response.data.success) {
        await fetchCart();
        await fetchCartCount();
        return { success: true, message: 'Item added to cart!' };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add item to cart' 
      };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem({ itemId, quantity });
      if (response.data.success) {
        await fetchCart();
        await fetchCartCount();
        return { success: true, message: 'Cart updated!' };
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update cart' 
      };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.removeFromCart(itemId);
      if (response.data.success) {
        await fetchCart();
        await fetchCartCount();
        return { success: true, message: 'Item removed from cart!' };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to remove item from cart' 
      };
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartAPI.clearCart();
      if (response.data.success) {
        setCart([]);
        setCartCount(0);
        return { success: true, message: 'Cart cleared!' };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to clear cart' 
      };
    }
  };

  const value = {
    cart,
    cartCount,
    loading,
    initialized,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    fetchCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
