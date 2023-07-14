const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const authenticateToken = require('../middleware/authenticateToken');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// POST /api/cart/add
router.post('/addcart', authenticateToken, async (req, res) => {
  try {
    const cartItem = new Cart({
      user: req.user._id,
      products: req.body.products,
    });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const carts = await Cart.find({ user: req.user._id }).populate('products.product'); // Adjusted to reference `req.user._id`
    res.json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// PUT /api/cart/:id
// PUT /api/cart/:id
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { product_id, quantity } = req.body;

  try {
    const cart = await Cart.findById(id);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === product_id);

    if (productIndex !== -1) {
      // Product found in cart, update the quantity
      const productInCart = cart.products[productIndex];
      productInCart.quantity += quantity;

      // Don't allow quantity to be less than 1
      if (productInCart.quantity < 1) {
        productInCart.quantity = 1;
      }
    } else {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating cart item quantity' });
  }
});


// DELETE /api/cart/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid item identifier' });
    }
    const cartItem = await Cart.findById(id);
    if (!cartItem || cartItem.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Cart item not found or unauthorized' });
    }
    await Cart.deleteOne({ _id: id });
    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT /api/carts/:cartId/items/:itemId/decrease
router.put('/:cartId/items/:itemId/decrease', authenticateToken, async (req, res) => {
  const { cartId, itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.products.findIndex(p => p._id.toString() === itemId);

    if (itemIndex !== -1) {
      // Item found in cart, update the quantity
      const item = cart.products[itemIndex];

      if (item.quantity > 1) {
        item.quantity += quantity; // Assuming quantity is negative
      } else {
        return res.status(400).json({ error: "Item quantity cannot go below 1" });
      }

    } else {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating item quantity in cart' });
  }
});


// PUT /api/carts/:cartId/items/:itemId/increase
router.put('/:cartId/items/:itemId/increase', authenticateToken, async (req, res) => {
  const { cartId, itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.products.findIndex(p => p._id.toString() === itemId);

    if (itemIndex !== -1) {
      // Item found in cart, update the quantity
      const item = cart.products[itemIndex];
      item.quantity += quantity;
    } else {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating item quantity in cart' });
  }
});

module.exports = router;
