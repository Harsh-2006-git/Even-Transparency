import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function createAdmin() {
  try {
    const email = (process.argv[2] || 'admin@evenshift.org').trim().toLowerCase();
    const password = (process.argv[3] || 'admin@pass123').trim();
    const fullName = (process.argv[4] || 'System Administrator').trim();

    console.log(`Connecting to database to create admin user: ${email}...`);

    await db.sequelize.authenticate();
    console.log('Database connected successfully.');

    // Check if user already exists
    const existing = await db.User.findOne({ where: { email } });
    if (existing) {
      console.log(`User ${email} already exists. Updating password hash...`);
      const password_hash = await bcrypt.hash(password, 10);
      await existing.update({
        password_hash,
        role: 'Super Admin',
        status: 'active'
      });
      console.log(`User ${email} password updated successfully.`);
      process.exit(0);
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      id: uuidv4(),
      email,
      password_hash,
      full_name: fullName,
      role: 'Super Admin',
      designation: 'Platform Super Administrator',
      department: 'Platform Governance',
      status: 'active',
      permissions: { all: true }
    });

    console.log(`Admin user created successfully in database:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Status: ${user.status}`);
    console.log(`\nYou can now log in using these real DB credentials!`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
