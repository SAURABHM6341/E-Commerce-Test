import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Our E-Commerce Platform</h1>
        <p>Discover amazing products at great prices</p>
      </header>
      
      <section className="hero-section">
        <div className="hero-content">
          <h2>Find What You're Looking For</h2>
          <p>Browse through thousands of products from top brands</p>
          <div className="cta-buttons">
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
            <Link to="/signup" className="btn btn-secondary">
              Join Us
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h3>Why Choose Us?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>🚚 Fast Delivery</h4>
            <p>Get your orders delivered quickly and safely</p>
          </div>
          <div className="feature-card">
            <h4>💳 Secure Payment</h4>
            <p>Your payment information is always protected</p>
          </div>
          <div className="feature-card">
            <h4>🔄 Easy Returns</h4>
            <p>Hassle-free returns within 30 days</p>
          </div>
          <div className="feature-card">
            <h4>📞 24/7 Support</h4>
            <p>We're here to help you anytime you need</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
