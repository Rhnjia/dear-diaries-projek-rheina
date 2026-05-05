const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isSecret: {
        type: Boolean,
        default: false
    },
    pin: {
        type: String // 6-digit PIN
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Folder', FolderSchema);
