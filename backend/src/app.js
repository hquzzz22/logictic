const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const postRoutes = require('./routes/postRoutes');
const postCategoryRoutes = require('./routes/postCategoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const settingRoutes = require('./routes/settingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');

// Routes
app.use('/api/users', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/post-categories', postCategoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/shipments', shipmentRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Superman Transport API' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
