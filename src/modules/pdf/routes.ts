import { Router } from 'express';
import { downloadBMIPdf, downloadIshiharaPdf } from './controller';

const router = Router();

router.get('/bmi/:applicationId', downloadBMIPdf);
router.get('/ishihara/:applicationId', downloadIshiharaPdf);

export default router;