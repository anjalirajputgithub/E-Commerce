const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET/api/orders/my-orders
// get logged-in user's orders nad private access
router.get("/my-orders", protect, async (req, res) => {
    try {
        //find orders for authentication user
        const orders = await Order.find({user: req.user._id}).sort({
            createdAt: -1,
        }); // sorted by most recent orders
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"})
    }
});

///@route GEt /api/orders/:id
// get order details by ID
router.get("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user", "name email"
        );
        if(!order){
            return res.status(404).json({message: "Orders not found"});
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;