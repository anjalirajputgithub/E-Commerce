const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    const {name, email, password} = req.body;
    try{
    //    Registration Logic
        let user = await User.findOne({email});
        if(user) return res.status(400).json({message: "User already exit"});
        user = new User({name, email, password});
        await user.save();

        //Create JWT Payload
        const payload = { user : {id: user._id, role: user.role} };

        //Sign and return token along with user data 
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "40h"}, (err, token) => {
            if (err) throw err;
            res.status(201).json({
                user:{
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                },
                token,
            });
        });
    }catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Server Error")
    }
});

// route Post /api/users/login
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid Credentials"});

        const isMatch = await user.matchPassword(password);
        if(!isMatch) return res.status(400).json({message : "Invalid Credentials"});

        //Create JWT Payload
        const payload = { user : {id: user._id, role: user.role} };

        //Sign and return token along with user data 
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "40h"}, (err, token) => {
            if (err) throw err;
            res.json({
                user:{
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role,
                },
                token,
            });
        });
    }catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

//route GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});
module.exports = router;                        