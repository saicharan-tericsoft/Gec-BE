import { Request, Response } from 'express';
import * as authService from '../auth/service';
import { User } from '../user/model';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const token = await authService.adminLogin(
      req.body.email,
      req.body.password
    );
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const requestOTP = async (req: Request, res: Response) => {
  try {
    const emailId = req.body.email;
    const applicationId = req.body.applicationId;
    const flag = emailId.includes('@') ? true : false;
    await authService.requestStudentOTP(emailId, applicationId, flag);
    res.json({ message: 'OTP sent' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const studentLogin = async (req: Request, res: Response) => {
  try {
    const token = await authService.studentLogin(
      req.body.email,
      req.body.otp
    );
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
        const students = await User.find({ role: 'student' })
      .select('name email applicationId');

    res.json(students);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};