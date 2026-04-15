import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: String,
    phoneNo: String,
    otp: String,
    expiresAt: Date
});

export const OTP = mongoose.model('OTP', otpSchema);