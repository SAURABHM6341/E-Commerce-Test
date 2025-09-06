const express = require('express');
const router = express.Router();
const {
    createItem,
    getAllItems,
    getItem,
    updateItem,
    deleteItem,
    getCategories,
    getItemsByCategory
} = require('../controllers/itemController');
const { auth, isAdmin } = require('../middlewares/auth');

// Public routes
router.get('/', getAllItems);
router.get('/categories', getCategories);
router.get('/category/:category', getItemsByCategory);
router.get('/:id', getItem);

// Admin only routes
router.post('/', auth, isAdmin, createItem);
router.put('/:id', auth, isAdmin, updateItem);
router.delete('/:id', auth, isAdmin, deleteItem);

module.exports = router;
