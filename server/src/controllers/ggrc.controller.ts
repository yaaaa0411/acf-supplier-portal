import type { Request, Response, NextFunction } from 'express';
import { fetchGgrcReceiptPdf, GgrcServiceError } from '../services/ggrc.service.js';
import { isValidWorkOrderNumber } from '../utils/validation.js';
import { logger } from '../utils/logger.js';

/**
 * Handles payment receipt download requests.
 */
export async function downloadGgrcReceipt(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { workOrderNumber } = req.body;

    if (!workOrderNumber) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Work Order Number (workOrderNumber) is required.',
      });
      return;
    }

    if (!isValidWorkOrderNumber(workOrderNumber)) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid Work Order Number format. Expected format: YYYY-PREFIX-SEQUENCE (e.g. 2627-GS-565).',
      });
      return;
    }

    logger.info(`Received valid request to download GGRC receipt for: ${workOrderNumber}`);

    // Call service to download PDF
    const pdfBuffer = await fetchGgrcReceiptPdf(workOrderNumber.trim());

    // Stream PDF directly to client
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="GGRC_Receipt_${workOrderNumber.trim().replace(/-/g, '_')}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.end(pdfBuffer);
    logger.info(`Streamed GGRC receipt successfully for: ${workOrderNumber}`);
  } catch (err: any) {
    if (err instanceof GgrcServiceError) {
      res.status(err.statusCode).json({
        error: err.code,
        message: err.message,
      });
      return;
    }
    next(err);
  }
}
