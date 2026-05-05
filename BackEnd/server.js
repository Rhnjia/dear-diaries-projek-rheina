require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./Routes/auth');
const diaryRoutes = require('./Routes/diary');
const folderRoutes = require('./Routes/folder');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/diary_rheina');

app.get('/', (req, res) => {
    res.json({ message: "Backend Diary Rheina is running!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/folder', folderRoutes);

app.listen(5000, () => console.log('💖 Backend Diary Rheina running on port 5000'));