require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const seed = async () => {
  await connectDB();

  try {
    // Xoa du lieu cu
    await User.deleteMany();

    console.log('Da xoa du lieu cu');

    // Tao admin
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@spmt.com.vn',
      password: 'admin123',
      isAdmin: true,
    });
    await adminUser.save();

    console.log('Da tao admin: admin@spmt.com.vn / admin123');

    console.log('\nSeeder hoan thanh!');
    console.log('Dang nhap: admin@spmt.com.vn / admin123');

    process.exit(0);
  } catch (error) {
    console.error('Loi seeder:', error);
    process.exit(1);
  }
};

seed();
