const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: 'Please enter all fields.' });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name, email, password: hashedPassword,
            // role: 'citizen',
        });
        await user.save();

        res.status(201).json({ msg: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- LOGIN ROUTE 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id, role: user.role, name: user.name, } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
        res.status(200).json({ message: "Login Successful", token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;