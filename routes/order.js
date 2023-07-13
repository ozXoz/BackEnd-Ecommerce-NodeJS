
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateToken = require('../middleware/authenticateToken');


// POST /api/orders - Add new order
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// PUT /api/orders/:id - Update order status
router.put('/update/:id', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access forbidden. Admin only.' });
    }

    try {
        const { status } = req.body; // We only want to update the status
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// DELETE /api/orders/:id - Delete order
router.delete('/:id', authenticateToken, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access forbidden. Admin only.' });
    }

    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await Order.findByIdAndDelete(req.params.id);

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});




// GET /api/orders/:id - Get order by id
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/orders - Get all orders
router.get('/', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get("/income", authenticateToken, async (req, res) => {
    const date = new Date();
    const lastMonth = date.getMonth();
    const lastYear = date.getFullYear();
  
    try {
      const income = await Order.aggregate([
        { 
          $match: { 
            $expr: {
              $and: [
                { $eq: [ { $year: "$createdAt" }, lastYear ] },
                { $eq: [ { $month: "$createdAt" }, lastMonth ] }
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);
      res.status(200).json({ income: income.length > 0 ? income[0].total : 0 });
    } catch (err) {
      res.status(500).json(err);
    }
  });







module.exports = router;


