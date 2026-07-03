import { User } from '../models/index.js';
import connectDB from '../config/database.js';

/**
 * Seed admin user if no admin exists
 * This runs automatically when the server starts
 */
export const seedAdmin = async (): Promise<void> => {
  try {
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if credentials exist
    if (!adminEmail || !adminPassword) {
      console.warn('⚠️  Admin credentials not found in environment variables');
      console.warn('   Set ADMIN_EMAIL and ADMIN_PASSWORD in .env file');
      return;
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: adminEmail,
      role: 'admin'
    });

    if (existingAdmin) {
      console.log(`✅ Admin already exists: ${adminEmail}`);
      return;
    }

    // Check if any admin exists
    const anyAdmin = await User.findOne({ role: 'admin' });
    if (anyAdmin) {
      console.log(`✅ Admin user already exists with email: ${anyAdmin.email}`);
      return;
    }

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });

    console.log(`🎉 Admin user created successfully!`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword} (Please change this after first login)`);
    console.log(`   ID: ${admin._id}`);

  } catch (error: any) {
    console.error('❌ Failed to seed admin user:', error.message);
    throw error;
  }
};