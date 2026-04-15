import express from 'express';
import {
  adminLogin,
  getAllStudents,
  requestOTP,
  studentLogin
} from '../auth/controller';

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/student/request-otp', requestOTP);
router.post('/student/login', studentLogin);
router.get('/admin/students', getAllStudents);

export default router;