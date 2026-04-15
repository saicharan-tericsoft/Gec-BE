import { sendEmailOTP } from "../../services/email.service";
import { OTP } from "./model";

export const generateOTP = async (email: string) => {
  const field = email.includes('@') ? 'email' : 'phoneNo';
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.findOneAndUpdate(
    { [field]: email },
    {
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
    },
    { upsert: true, new: true }
  );

  if (field === 'email') {
    await sendEmailOTP(email, otp);
  }

  console.log(`OTP for ${email}: ${otp}`); // add logic for sending email

  return otp;
};

export const verifyOTP = async (email: string, otp: string, field: string) => {
  const record = await OTP.findOne({ [field]: email, otp });

//   if (!record) return false;

  if (!record || !record.expiresAt || record.expiresAt < new Date()) return false;

  return true;
};