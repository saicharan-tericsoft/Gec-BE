"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailOTP = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const resend_1 = require("resend");
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'shashank123414@outlook.com',
        pass: 'Samsung@098'
    },
    tls: {
        ciphers: 'SSLv3'
    }
});
// export const sendEmailOTP = async(to: string, otp: string) => {
//     try {
//         await transporter.sendMail({
//             from: `"Test Platform" <${process.env.EMAIL_USER}>`,
//             to,
//             subject: 'Your OTP Code',
//             html: `
//       <h2>Your OTP is: ${otp}</h2>
//       <p>This OTP is valid for 5 minutes.</p>
//     `
//         });
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };
const resend = new resend_1.Resend('re_6VhnLBzV_MSiWKVZ99j3USJUm5E3F5dxu');
const sendEmailOTP = async (email, otp) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'OTP for logging into GEC',
            html: `
        <h2>Your OTP is: ${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
      `
        });
        // await resend.emails.send({
        //   from: 'onboarding@resend.dev',
        //   to: to,
        //   subject: 'Your OTP Code',
        //   html: `
        //     <h2>Your OTP is: ${otp}</h2>
        //     <p>This OTP is valid for 5 minutes.</p>
        //   `
        // });
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
};
exports.sendEmailOTP = sendEmailOTP;
