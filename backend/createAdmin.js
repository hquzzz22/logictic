require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@logictic.com' });
    
    if (adminExists) {
      console.log('Admin user already exists: admin@logictic.com');
      process.exit();
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@logictic.com',
      password: 'password123',
      isAdmin: true,
    });

    if (admin) {
      console.log('====================================');
      console.log('Admin user created successfully!');
      console.log('Email: admin@logictic.com');
      console.log('Password: password123');
      console.log('====================================');
      process.exit();
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
