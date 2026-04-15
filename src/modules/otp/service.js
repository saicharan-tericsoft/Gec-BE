"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.generateOTP = void 0;
const email_service_1 = require("../../services/email.service");
const model_1 = require("./model");
const generateOTP = async (email) => {
    const field = email.includes('@') ? 'email' : 'phoneNo';
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await model_1.OTP.findOneAndUpdate({ [field]: email }, {
        email,
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
    }, { upsert: true, new: true });
    if (field === 'email') {
        await (0, email_service_1.sendEmailOTP)(email, otp);
    }
    console.log(`OTP for ${email}: ${otp}`); // add logic for sending email
    return otp;
};
exports.generateOTP = generateOTP;
const verifyOTP = async (email, otp, field) => {
    const record = await model_1.OTP.findOne({ [field]: email, otp });
    //   if (!record) return false;
    if (!record || !record.expiresAt || record.expiresAt < new Date())
        return false;
    return true;
};
exports.verifyOTP = verifyOTP;
