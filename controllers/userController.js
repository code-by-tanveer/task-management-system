const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

exports.registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const user = new User({ email, password, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', token: token, userId: user._id, role: user.role });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = 'email', sortOrder = 'asc', filterRole } = req.query;

        const pageNumber = parseInt(page);
        const itemsPerPage = parseInt(pageSize);
        const skip = (pageNumber - 1) * itemsPerPage;

        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const filter = {};
        if (filterRole) {
            filter.role = filterRole;
        }

        const users = await User.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(itemsPerPage)
            .select('-password');

        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        res.status(200).json({
            users,
            page: pageNumber,
            pageSize: itemsPerPage,
            totalPages,
            totalUsers,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};


exports.createUserByAdmin = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const user = new User({ email, password, role });
        await user.save();

        res.status(201).json({ message: 'User created by admin successfully', user: { _id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Error creating user by admin:', error);
        res.status(500).json({ message: 'Failed to create user by admin', error: error.message });
    }
};

exports.getUserByAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by admin:', error);
        res.status(500).json({ message: 'Failed to fetch user by admin', error: error.message });
    }
};

exports.updateUserByAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated by admin successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user by admin:', error);
        res.status(500).json({ message: 'Failed to update user by admin', error: error.message });
    }
};

exports.deleteUserByAdmin = async (req, res) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted by admin successfully' });
    } catch (error) {
        console.error('Error deleting user by admin:', error);
        res.status(500).json({ message: 'Failed to delete user by admin', error: error.message });
    }
};