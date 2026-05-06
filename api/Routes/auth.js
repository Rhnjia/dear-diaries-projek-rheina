const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.post('/register', async (req, res) => {
    const hashData = (data) => bcrypt.hash(data, 10);
    const passwordHash = await hashData(req.body.password);
    const pinHash = await hashData(req.body.pin);
    
    try {
        const user = await User.create({ 
            ...req.body, 
            password: passwordHash,
            pin: pinHash
        });
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body.email);
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json('User not found');
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            console.log('Invalid password for user:', user.email);
            return res.status(400).json('Wrong password');
        }

        const token = jwt.sign({ id: user._id }, process.env.RHEINA_SECRET || 'RHEINA_SECRET');
        console.log('Login successful for:', user.email);
        res.json({ token, user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json(err.message);
    }
});

router.put('/profile', upload.single('profilePic'), async (req, res) => {
    try {
        const token = req.header('Authorization');
        const verified = jwt.verify(token, process.env.RHEINA_SECRET || 'RHEINA_SECRET');
        
        const updateData = {};
        if (req.file) updateData.profilePic = `/uploads/${req.file.filename}`;
        
        const user = await User.findByIdAndUpdate(verified.id, { $set: updateData }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;