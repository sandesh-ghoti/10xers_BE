'use strict';
import { scryptSync } from 'crypto';
import { Role } from '../common';
import { SALT } from '../config/serverConfig';
import User from '../models/user';

const systemAdminEmail = 'system@admin.com';
const systemAdminPassword = 'admin123';

export default async () => {
  try {
    const existing = await User.findOne({ where: { email: systemAdminEmail } });
    if (existing) {
      console.log('System admin already exists.');
      return;
    }

    const hashedPassword = scryptSync(systemAdminPassword, SALT, 32).toString('hex');

    const user = await User.create({
      email: systemAdminEmail,
      password: hashedPassword,
      role: Role.SYSTEM_ADMIN,
    });

    console.log('System admin created:', user.email);
  } catch (err) {
    console.error('Failed to seed system admin:', err);
  }
};
