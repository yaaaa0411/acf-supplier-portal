import { Router } from 'express';
import { downloadGgrcReceipt } from '../controllers/ggrc.controller.js';

const router = Router();

// Endpoint to trigger receipt download
router.post('/download-ggrc-receipt', downloadGgrcReceipt);

export default router;
