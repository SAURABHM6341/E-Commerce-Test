const Item = require('../Models/item');

// Create Item (Admin only)
exports.createItem = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            brand,
            stock,
            images,
            features
        } = req.body;

        // Validation
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, description, price, category)'
            });
        }

        const item = await Item.create({
            name,
            description,
            price,
            category,
            brand,
            stock: stock || 0,
            images: images || [],
            features: features || []
        });

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            item
        });

    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get All Items with Filters
exports.getAllItems = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            minPrice,
            maxPrice,
            brand,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            inStock
        } = req.query;

        // Build filter object
        const filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (brand) {
            filter.brand = new RegExp(brand, 'i');
        }

        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') }
            ];
        }

        if (inStock === 'true') {
            filter.stock = { $gt: 0 };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const items = await Item.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        const totalItems = await Item.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            success: true,
            items,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalItems,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Single Item
exports.getItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id);
        if (!item || !item.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(200).json({
            success: true,
            item
        });

    } catch (error) {
        console.error('Get item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update Item (Admin only)
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const item = await Item.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            item
        });

    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete Item (Admin only) - Soft delete
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });

    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Item.distinct('category', { isActive: true });
        
        res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Items by Category
exports.getItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;
        const items = await Item.find({ 
            category: category.toLowerCase(), 
            isActive: true 
        })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

        const totalItems = await Item.countDocuments({ 
            category: category.toLowerCase(), 
            isActive: true 
        });

        res.status(200).json({
            success: true,
            items,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalItems / limit),
                totalItems
            }
        });

    } catch (error) {
        console.error('Get items by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
