const express = require('express');
const router = express.Router();
const Diary = require('../models/Diary');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'diary-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.RHEINA_SECRET || 'RHEINA_SECRET');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Create a new diary entry
router.post('/', auth, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), async (req, res) => {
    try {
        const diaryData = {
            ...req.body,
            userId: req.user.id
        };
        if (req.files) {
            if (req.files.photo) diaryData.mediaUrl = `/uploads/${req.files.photo[0].filename}`;
            if (req.files.audio) diaryData.audioUrl = `/uploads/${req.files.audio[0].filename}`;
        }
        const diary = new Diary(diaryData);
        const savedDiary = await diary.save();
        res.json(savedDiary);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get all diary entries for a user
router.get('/', auth, async (req, res) => {
    try {
        const query = { userId: req.user.id };
        if (req.query.folderId) {
            query.folderId = req.query.folderId;
        }
        const diaries = await Diary.find(query).sort({ date: -1 });
        res.json(diaries);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get a single diary entry
router.get('/:id', auth, async (req, res) => {
    try {
        const diary = await Diary.findOne({ _id: req.params.id, userId: req.user.id });
        if (!diary) return res.status(404).send('Diary not found');
        res.json(diary);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Update a diary entry
router.put('/:id', auth, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.files) {
            if (req.files.photo) updateData.mediaUrl = `/uploads/${req.files.photo[0].filename}`;
            if (req.files.audio) updateData.audioUrl = `/uploads/${req.files.audio[0].filename}`;
        }
        
        const updatedDiary = await Diary.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: updateData },
            { new: true }
        );
        if (!updatedDiary) return res.status(404).send('Diary not found');
        res.json(updatedDiary);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete a diary entry
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log(`DELETE request for diary ${req.params.id} by user ${req.user.id}`);
        const deletedDiary = await Diary.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedDiary) {
            console.log('Diary not found or user unauthorized');
            return res.status(404).send('Diary not found');
        }
        console.log('Diary deleted successfully');
        res.json({ message: 'Diary deleted' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(400).send(err.message);
    }
});

module.exports = router;