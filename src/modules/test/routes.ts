import { Router } from 'express';
import { firstTime, submitTest } from './controller';

const router = Router();

router.post('/submit', submitTest);
router.get('/firstTime/:applicationId/:route', firstTime);

export default router;