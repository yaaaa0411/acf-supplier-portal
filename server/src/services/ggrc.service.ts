import { chromium } from 'playwright';
import fs from 'fs';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class GgrcServiceError extends Error {
  constructor(message: string, public code: string, public statusCode: number = 400) {
    super(message);
    this.name = 'GgrcServiceError';
  }
}

/**
 * Automates GGRC payment receipt lookup and download.
 */
export async function fetchGgrcReceiptPdf(workOrderNumber: string): Promise<Buffer> {
  logger.info(`Starting GGRC receipt download process for: ${workOrderNumber}`);
  
  // Launch Playwright browser
  const browser = await chromium.launch({
    headless: env.BULLSEYE_PLAYWRIGHT_HEADLESS,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    acceptDownloads: true
  });

  const page = await context.newPage();
  page.setDefaultTimeout(env.REQUEST_TIMEOUT_MS);

  try {
    logger.info(`Navigating to GGRC portal: ${env.GGRC_URL}`);
    try {
      await page.goto(env.GGRC_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (e: any) {
      throw new GgrcServiceError(
        'GGRC website is currently unavailable or took too long to respond.',
        'GGRC_UNAVAILABLE',
        503
      );
    }

    // Locate the "Reg No" input field under Generate Payslip
    const regNoInputSelectors = [
      'input#txtRegPay',
      'input[id*="txtRegPay"]',
      'input[name*="RegPay"]',
      'input[id*="RegPay"]',
    ];

    let regNoInput = null;
    for (const selector of regNoInputSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        regNoInput = element;
        logger.info(`Found Generate Payslip Registration Number field using selector: ${selector}`);
        break;
      }
    }

    if (!regNoInput) {
      throw new GgrcServiceError('Could not find Generate Payslip Registration Number field on GGRC portal.', 'SELECTOR_ERROR', 500);
    }

    // Input the Work Order Number
    await regNoInput.fill(workOrderNumber);
    logger.info(`Filled registration input with: ${workOrderNumber}`);

    // Locate the "Download Payment Receipt" button under Generate Payslip
    const downloadButtonSelectors = [
      'input#btnPaySlip',
      'input[id*="btnPaySlip"]',
      'input[name*="btnPaySlip"]',
      'input[value*="Download Payment Receipt"]',
      'button:has-text("Download Payment Receipt")',
      '[id*="DownloadPaymentReceipt"]',
      '[id*="btnDownload"]',
    ];

    let downloadButton = null;
    for (const selector of downloadButtonSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        downloadButton = element;
        logger.info(`Found Download Payment Receipt button using selector: ${selector}`);
        break;
      }
    }

    if (!downloadButton) {
      throw new GgrcServiceError('Could not find Download Payment Receipt button on GGRC portal.', 'SELECTOR_ERROR', 500);
    }

    // Set up a listener for browser dialogs first.
    let alertMsg: string | null = null;
    let rejectDownload: ((reason: any) => void) | null = null;

    page.on('dialog', async (dialog) => {
      alertMsg = dialog.message();
      logger.warn(`Browser dialog appeared: ${alertMsg}`);
      await dialog.dismiss();
      if (rejectDownload) {
        rejectDownload(new GgrcServiceError(`GGRC alert: ${alertMsg}`, 'RECEIPT_NOT_FOUND', 404));
      }
    });

    // Intercept and download PDF
    logger.info('Clicking Download Payment Receipt button to retrieve PDF...');
    
    const downloadPromise = new Promise<any>((resolve, reject) => {
      rejectDownload = reject;
      
      // Also check for standard download event
      page.waitForEvent('download', { timeout: 15000 })
        .then(resolve)
        .catch((e) => {
          if (alertMsg) {
            reject(new GgrcServiceError(`GGRC alert: ${alertMsg}`, 'RECEIPT_NOT_FOUND', 404));
          } else {
            reject(new GgrcServiceError('Timeout waiting for receipt download to initiate.', 'DOWNLOAD_TIMEOUT', 408));
          }
        });
    });

    await downloadButton.click();

    const download = await downloadPromise;

    const tempPath = await download.path();
    if (!tempPath) {
      throw new GgrcServiceError('Failed to capture downloaded receipt file path.', 'DOWNLOAD_FAILED', 500);
    }

    logger.info(`Download completed. Temp file stored at: ${tempPath}`);
    const pdfBuffer = await fs.promises.readFile(tempPath);

    // Clean up temporary download file immediately
    await fs.promises.unlink(tempPath).catch((err) => {
      logger.warn(`Could not delete temp file ${tempPath}: ${err.message}`);
    });

    return pdfBuffer;
  } catch (err: any) {
    if (err instanceof GgrcServiceError) {
      throw err;
    }
    logger.error('Playwright execution error:', err);
    throw new GgrcServiceError(`Internal automation failure: ${err.message}`, 'PLAYWRIGHT_ERROR', 500);
  } finally {
    // Make sure we always clean up browser
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
    logger.info('Playwright browser session cleaned up.');
  }
}
