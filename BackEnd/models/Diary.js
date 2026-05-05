const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder'
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String
    },
    spotifyUrl: {
        type: String
    },
    audioUrl: {
        type: String
    },
    pin: {
        type: String // Optional PIN for specific diary protection
    },
    stickers: [
        {
            icon: String,
            x: Number,
            y: Number
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Diary', DiarySchema);