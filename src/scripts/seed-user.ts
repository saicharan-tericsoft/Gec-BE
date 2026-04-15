import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../modules/user/model';

dotenv.config();

const run = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('DB connected');

    // 2. Hash password
    const hash = await bcrypt.hash('1234', 10);

    // 3. Create user
    const user = await User.create({
      email: 'tempunberry004@yopmail.com',
      phoneNo: 1234567890,
      applicationId: 'APP001',
      passwordHash: hash,
      role: 'student',
      isEligible: true
      // role: 'admin',
      // adminType: 'super' 
    });

    console.log('User created:', user.email);

    // 4. Exit
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();