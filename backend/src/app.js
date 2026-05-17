const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const postRoutes = require('./routes/postRoutes');
const postCategoryRoutes = require('./routes/postCategoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const settingRoutes = require('./routes/settingRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Routes
app.use('/api/users', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/post-categories', postCategoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Nongsanshop API' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
