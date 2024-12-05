const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import cors
require('dotenv').config();
const path = require('path');
const multer = require('multer'); // Import multer for file uploads

const app = express();
const PORT = process.env.PORT || 4000;

// Log critical environment variables for debugging (remove in production)
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Middleware to parse JSON
app.use(express.json());

// Allow all origins
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: false, // Disable credentials if not required
}));

// Enable preflight requests for all routes
app.options('*', cors());


// Debug preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'https://shelfshare-final.herokuapp.com');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200); // Respond OK
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: '' },
    description: { type: String, default: '' }
});

const User = mongoose.model('User', userSchema);

// Middleware to authenticate the token
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
};

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.error('User not found');
            return res.status(404).json({ status: 'error', message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Incorrect password');
            return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ status: 'success', token });
    } catch (err) {
        console.error('Error during login process:', err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Update Profile Endpoint
app.put('/profile', authenticate, upload.single('profileImage'), async (req, res) => {
    try {
        const userId = req.user.id;

        let updateData = {};

        // Handle file upload
        if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }

        // Update description
        if (req.body.description) {
            updateData.description = req.body.description;
        }

        await User.findByIdAndUpdate(userId, updateData);

        res.json({ status: 'success', message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Fetch Profile Endpoint
app.get('/profile', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // Avoid sending the password

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.json({ status: 'success', user });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// User Registration Endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email: email.toLowerCase(), password: hashedPassword });
        await newUser.save();

        res.status(201).json({ status: 'success', message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Serve Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Admin Users Endpoint (Example)
app.get('/admin/users', authenticate, async (req, res) => {
    // Ensure this route is accessed by an admin only
    if (!req.user.isAdmin) {
        return res.status(403).json({ status: 'error', message: 'Access forbidden' });
    }

    try {
        const users = await User.find({}, 'email'); // Fetch all users, showing only emails
        res.json({ status: 'success', users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
