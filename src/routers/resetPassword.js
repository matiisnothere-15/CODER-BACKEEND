import { Router } from "express";
import { requestPasswordReset, resetPassword } from '../services/sessionsService.js';


const router = Router();

router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;
