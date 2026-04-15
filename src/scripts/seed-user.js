"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const model_1 = require("../modules/user/model");
dotenv_1.default.config();
const run = async () => {
    try {
        // 1. Connect to DB
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('DB connected');
        // 2. Hash password
        const hash = await bcrypt_1.default.hash('1234', 10);
        // 3. Create user
        const user = await model_1.User.create({
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
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
run();
