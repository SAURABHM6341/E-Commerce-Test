import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, fetchCartCount } = useCart();

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount(); // Fetch cart count when user is logged in
    }
  }, [isLoggedIn, fetchCartCount]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          E-Commerce
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Products
          </Link>
          
          {isLoggedIn && (
            <Link 
              to="/cart" 
              className={`navbar-link cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          )}
          
          {isLoggedIn ? (
            <>
              {user?.role === 'admin' && (
                <Link 
                  to="/add-card" 
                  className={`navbar-link ${location.pathname === '/add-card' ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Add Product
                </Link>
              )}
              <div className="navbar-user">
                <span className="user-name">Hello, {user?.name}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link 
                to="/login" 
                className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className={`navbar-link signup-link ${location.pathname === '/signup' ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
