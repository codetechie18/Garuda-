const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();


// --- REGISTER ROUTE 
router.post('/register', async (req, res) => {
    const { username, email, fullName, password } = req.body;

    if (!username || !email || !fullName || !password) {
        return res.status(400).json({ msg: "Please enter all fields." });
    }

    try {
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ msg: 'User with this email already exists.' });
        }

        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ msg: 'This username is already taken.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            fullName,
            passwordHash: passwordHash
        });

        await newUser.save();

        // Success response
        res.status(201).json({ 
            msg: 'Registration successful!',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// --- LOGIN ROUTE 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                roles: user.roles
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    user: payload.user 
                });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// LOGOUT ROUTE
router.post('/logout', (req, res) => {
    res.status(200).json({ msg: "Logout successful" });
});

module.exports = router;