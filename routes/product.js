const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticateToken=require('../middleware/authenticateToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

router.post('/addproduct', authenticateToken, async (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access forbidden. Admin only.' });
    }
    const product = new Product(req.body);
    try {
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
});

router.put('/product/:id', authenticateToken, async (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access forbidden. Admin only.' });
    }
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

router.delete('/product/:id', authenticateToken, async (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access forbidden. Admin only.' });
    }
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
});

router.get('/product/:id', authenticateToken, async (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access forbidden. Admin only.' });
    }
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

router.get('/product', async (req, res, next) => {
    const { new: isNew, categories } = req.query;
    let products;
    try {
        if (isNew) {
            products = await Product.find().sort({_id:-1}).limit(5);
        } else if (categories) {
            products = await Product.find({ categories: { $in: [categories] }}).sort({_id:-1}).limit(5);
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

// GET /api/products - Fetch all products
router.get('/', async (req, res, next) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
