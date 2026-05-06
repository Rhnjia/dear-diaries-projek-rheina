const express = require('express');
const router = express.Router();
const Folder = require('../models/Folder');
const jwt = require('jsonwebtoken');

// Middleware to check auth
const auth = (req, res, next) => {
    const token = req.header('Authorization');
    console.log(`Backend Auth: ${req.method} ${req.originalUrl} - Token present: ${!!token}`);
    if (!token) {
        console.warn(`Backend Auth: Denied Access to ${req.method} ${req.originalUrl} (No Token)`);
        return res.status(401).send('Access Denied');
    }
    try {
        const verified = jwt.verify(token, process.env.RHEINA_SECRET || 'RHEINA_SECRET');
        req.user = verified;
        next();
    } catch (err) {
        console.error(`Backend Auth: Invalid Token for ${req.method} ${req.originalUrl}`);
        res.status(400).send('Invalid Token');
    }
};

// Get all folders for user
router.get('/', auth, async (req, res) => {
    try {
        const folders = await Folder.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(folders);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create new folder
router.post('/', auth, async (req, res) => {
    try {
        const newFolder = new Folder({
            ...req.body,
            userId: req.user.id
        });
        const savedFolder = await newFolder.save();
        res.json(savedFolder);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Update folder
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedFolder = await Folder.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { $set: req.body },
            { new: true }
        );
        res.json(updatedFolder);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete folder
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log(`Backend: Deleting folder ${req.params.id} for user ${req.user.id}`);
        
        // 1. Unlink diaries from this folder (make them orphans)
        const Diary = require('../models/Diary');
        const updateResult = await Diary.updateMany(
            { folderId: req.params.id, userId: req.user.id },
            { $unset: { folderId: "" } }
        );
        console.log(`Backend: Unlinked ${updateResult.modifiedCount} diaries`);

        // 2. Delete the folder
        const deletedFolder = await Folder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        
        if (!deletedFolder) {
            console.warn(`Backend: Folder ${req.params.id} not found or unauthorized`);
            return res.status(404).send('Folder not found');
        }

        console.log('Backend: Folder deleted successfully');
        res.json({ message: 'Folder deleted' });
    } catch (err) {
        console.error('Backend: Delete folder error:', err);
        res.status(400).send(err.message);
    }
});

// Verify folder PIN
router.post('/verify-pin/:id', auth, async (req, res) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, userId: req.user.id });
        if (!folder) return res.status(404).json({ ok: false, message: 'Folder not found' });
        if (!folder.isSecret) return res.json({ ok: true });

        const { pin } = req.body;
        if (folder.pin === pin) {
            return res.json({ ok: true });
        } else {
            return res.status(401).json({ ok: false, message: 'PIN salah' });
        }
    } catch (err) {
        res.status(500).json({ ok: false, message: err.message });
    }
});

module.exports = router;
