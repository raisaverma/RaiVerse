require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@raisaverse.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user already exists with email: ${adminEmail}`);
      // Ensure role is admin just in case
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user role to admin.');
      }
    } else {
      // Create new admin
      const admin = await User.create({
        name: 'RaisaVerse Admin',
        email: adminEmail,
        password: 'adminpassword123',
        role: 'admin',
      });
      console.log(`Successfully created admin user!`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: adminpassword123`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
