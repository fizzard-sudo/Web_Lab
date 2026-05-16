const express = require("express");
const router = express.Router();
const Order = require("../../../models/Order");
const { verifyToken } = require("../../../middlewares/apiAuthMiddleware");

// @route   POST /api/v1/orders
// @desc    Place a new order
// @access  Private
router.post("/", verifyToken, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    const newOrder = new Order({
      user: req.user.user_id,
      products,
      totalAmount,
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
