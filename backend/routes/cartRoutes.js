const express = require('express');
const router = express.Router();
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount
} = require('../controllers/cartController');
const { auth } = require('../middlewares/auth');

// All cart routes require authentication
router.get('/', auth, getCart);
router.get('/count', auth, getCartCount);
router.post('/add', auth, addToCart);
router.put('/update', auth, updateCartItem);
router.delete('/remove/:itemId', auth, removeFromCart);
router.delete('/clear', auth, clearCart);

module.exports = router;
