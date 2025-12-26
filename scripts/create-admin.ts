/**
 * Script to create an admin user
 * Run with: npx ts-node scripts/create-admin.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Change this in production!

async function createAdmin() {
  const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
  
  // Read existing users
  let users: any[] = [];
  try {
    const content = fs.readFileSync(usersFilePath, 'utf-8');
    users = JSON.parse(content);
  } catch {
    users = [];
  }

  // Check if admin already exists
  const existingAdmin = users.find((u: any) => u.username === ADMIN_USERNAME);
  if (existingAdmin) {
    console.log('Admin user already exists!');
    return;
  }

  // Create admin user
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const adminUser = {
    id: `user_${Date.now()}_admin`,
    username: ADMIN_USERNAME,
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  users.push(adminUser);

  // Write back to file
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  
  console.log('Admin user created successfully!');
  console.log(`Username: ${ADMIN_USERNAME}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log('\nPlease change the password after first login!');
}

createAdmin().catch(console.error);
