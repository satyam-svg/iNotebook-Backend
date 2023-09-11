const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_Secret = "satyamisa@godd@boy@loafer";
const router = express.Router();
const fetchuser=require('../middleware/fetchuser');

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be 8 characters long').isLength({ min: 8 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            return res.status(400).json({ error: "Sorry, a user with this email already exists." });
        }
        const salt  = await bcrypt.genSalt(10);
        const secpass=await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email
        });
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_Secret);
        res.json({ authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Authentication of login system
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const passwordCompare =  await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Incorrect password" });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_Secret);
        res.json({ authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Authentication of getuser system
router.post('/getuser',fetchuser,  async (req, res) => {
      try {
        userId=req.user.id;
        const user=await User.findById(userId).select("-password")
       res.send(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
});
module.exports = router;
