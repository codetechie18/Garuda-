const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
const auth = require('../middlewares/authMiddleware'); //middleware
const User = require('../models/userSchema'); // User model

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
