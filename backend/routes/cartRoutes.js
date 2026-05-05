const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

//Helper function to get a cart by userId or guestId
const getCart = async (userId, guestId) => {
    if(userId) {
        return await Cart.findOne({user: userId});
    }else if(guestId) {
        return await Cart.findOne({guestId});
    }
    return null;
};

//@route /api/cart
///Add a Product to the Cart for a guest 
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if(!product) return res.status(404).json({message: "Product not found"});

        //dtermine if user is logged in or guest 
        let cart = await getCart(userId, guestId);

       ///if cart exist update it 
        if(cart) {
            const productIdx = cart.products.findIndex(
                (p) => 
                    p.productId.toString() === productId && 
                    p.size === size &&
                    p.color === color
            );
            if(productIdx > -1){
                //product already exist update it 
                cart.products[productIdx].quantity += quantity;
            } else {
                //add new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }
            //Recalculate the total price
            cart.totalPrice = cart.products.reduce((acc, item) => 
                acc + item.price * item.quantity, 0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else{ 
            //create a new cart 
            const newCart = await Cart.create({
              user: userId ? userId : undefined,
              guestId: guestId ? guestId : "guest_" + new Date().getTime(),
              products: [
                {
                  productId,
                  name: product.name,
                  image: product.images[0].url,
                  price: product.price,
                  size,
                  color,
                  quantity,
                },
              ],
              totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
});

//@route PUT /api/cart/
//Update the product quantity in cart for a guest or login user
router.put("/", async (req, res) => {
    const {productId, quantity, size, color, guestId, userId} = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if(!cart)return res.status(404).json({message: "Cart not found"});

        const productIdx = cart.products.findIndex(
            (p) => p.productId.toString() === productId && p.size === size && p.color === color
        );
        if(productIdx > -1){
            if(quantity > 0){
                cart.products[productIdx].quantity = quantity;
            } else {
                cart.products.splice(productIdx, 1); // Remove product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce((acc, item) => 
                acc + item.price * item.quantity, 0);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(400).json({message: "Product not found in cart"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("server error");
    }
});

//@route DELETE /api/cart
//Remove a product fromt the cart
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if(!cart) return res.status(404).json({message: "Cart not found"});

        const productIdx = cart.products.findIndex(
          (p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color === color
        );

        if(productIdx > -1){
            cart.products.splice(productIdx, 1); 
            cart.totalPrice = cart.products.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(400).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("server error");
    }
});

//@route GeT /api/cart
// get logged in user's or guest user's cart
router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;

    try {
        let cart = await getCart(userId, guestId);
        if(cart) {
            res.json(cart);
        } else {
            res.status(404).json({message: "Cart not found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("server error");
    }
});

///@route POST /api/cart/merge
//Merge guest cart into user cart or login
 router.post("/merge", protect, async (req,res) => {
    const { guestId } = req.body;
    try {
        const guestCart = await Cart.findOne({guestId});
        const userCart = await Cart.findOne({ user: req.user._id});

        if(guestCart) {
            if(guestCart.products.length === 0){
                return res.status(400).json({message: "Guest Cart is empty"})
            }
            if(userCart) {
                ///Merge guest cart into user
                guestCart.products.forEach((guestItem) => {
                    const productIdx = userCart.products.findIndex((item) => 
                       item.productId.toString() === guestItem.productId.toString()  && 
                       item.size === guestItem.size && item.color === guestItem.color
                    );
                    if(productIdx > -1){
                        //If items exist in the user cart, update the qunatity
                        userCart.products[productIdx].quantity += guestItem.quantity;
                    } else{
                        //otherwise add the guest item to the cart
                        userCart.products.push(guestItem);
                    }
                });
                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity, 0
                );
                await userCart.save();

                //Removing the guest cart after merging
                try {
                    await Cart.findOneAndDelete({ guestId });
                } catch (error) {
                    console.error("Error deleting guest cart:", error);
                }
                res.status(200).json(userCart);
            } else {
                //if user has no existing cart, assign guest cart to user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                res.status(200).json(guestCart);
            }
        } else {
            if(userCart){
                //Guest cart has already been merged
                return res.status(200).json(userCart);
            }
            res.status(404).json({message: "Guest cart not found"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Server Error"});
    }
 })


module.exports = router;