const Cart = require('../Models/cart');
const Item = require('../Models/item');
const User = require('../Models/user');

// Get User Cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.item', 'name description price images category stock');

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    items: [],
                    totalAmount: 0,
                    totalItems: 0
                }
            });
        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Add Item to Cart
exports.addToCart = async (req, res) => {
    try {
        const { itemId, quantity = 1 } = req.body;
        const userId = req.user.id;

        // Validate item exists and is active
        const item = await Item.findById(itemId);
        if (!item || !item.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Check stock availability
        if (item.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock available'
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{
                    item: itemId,
                    quantity,
                    price: item.price
                }]
            });
        } else {
            // Check if item already exists in cart
            const existingItemIndex = cart.items.findIndex(
                cartItem => cartItem.item.toString() === itemId
            );

            if (existingItemIndex > -1) {
                // Update quantity
                const newQuantity = cart.items[existingItemIndex].quantity + quantity;
                
                if (item.stock < newQuantity) {
                    return res.status(400).json({
                        success: false,
                        message: 'Insufficient stock available'
                    });
                }

                cart.items[existingItemIndex].quantity = newQuantity;
                cart.items[existingItemIndex].price = item.price; // Update price in case it changed
            } else {
                // Add new item
                cart.items.push({
                    item: itemId,
                    quantity,
                    price: item.price
                });
            }
        }

        await cart.save();

        // Populate cart before sending response
        await cart.populate('items.item', 'name description price images category stock');

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully',
            cart
        });

    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update Cart Item Quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.user.id;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        // Find cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Find item in cart
        const cartItemIndex = cart.items.findIndex(
            cartItem => cartItem.item.toString() === itemId
        );

        if (cartItemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Validate stock
        const item = await Item.findById(itemId);
        if (!item || !item.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (item.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock available'
            });
        }

        // Update quantity
        cart.items[cartItemIndex].quantity = quantity;
        cart.items[cartItemIndex].price = item.price; // Update price in case it changed

        await cart.save();

        // Populate cart before sending response
        await cart.populate('items.item', 'name description price images category stock');

        res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart
        });

    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Remove Item from Cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;

        // Find cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Remove item from cart
        cart.items = cart.items.filter(
            cartItem => cartItem.item.toString() !== itemId
        );

        await cart.save();

        // Populate cart before sending response
        await cart.populate('items.item', 'name description price images category stock');

        res.status(200).json({
            success: true,
            message: 'Item removed from cart successfully',
            cart
        });

    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Clear Cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart
        });

    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Cart Item Count
exports.getCartCount = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        
        const count = cart ? cart.totalItems : 0;

        res.status(200).json({
            success: true,
            count
        });

    } catch (error) {
        console.error('Get cart count error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
