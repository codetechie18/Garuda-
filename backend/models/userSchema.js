const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true 
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, 
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.']
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    roles: {
        type: String,
        enum: ['Super Admin', 'Admin', 'User'],
        default: 'User'
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
