import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.email);
      process.exit();
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin1234', // Must meet schema rules
      role: 'admin',
      status: 'active',
      isEmailVerified: true
    });

    await admin.save();
    console.log('✅ Admin created:', admin.email);
    process.exit();

  } catch (error) {
    console.error('❌ Failed to create admin:', error);
    process.exit(1);
  }
};

createAdmin();
