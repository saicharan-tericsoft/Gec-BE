import nodemailer from 'nodemailer';
import { Resend } from 'resend';


const transporter = nodemailer.createTransport({
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

const resend = new Resend('re_6VhnLBzV_MSiWKVZ99j3USJUm5E3F5dxu');

export const sendEmailOTP = async (email: string, otp: string) => {
  try {

  await  resend.emails.send({
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
  } catch (error) {
    console.error('Error sending email:', error);
  }
};