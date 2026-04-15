import express from 'express';
import * as userController from './controller';

const router = express.Router();
router.post('/disclaimerStudentInfo', userController.disclaimerStudentInfo);

export default router;