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

    // Locate the "Reg No" input field
    // GGRC Portal is an ASP.NET WebForms page, usually with ids containing txtRegNo, txt_RegNo, etc.
    const regNoInputSelectors = [
      'input[id*="txtRegNo"]',
      'input[id*="RegNo"]',
      'input[name*="RegNo"]',
      'input[placeholder*="Reg No"]',
      'input[placeholder*="Registration"]',
      'input[type="text"]'
    ];

    let regNoInput = null;
    for (const selector of regNoInputSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        regNoInput = element;
        logger.info(`Found Registration Number field using selector: ${selector}`);
        break;
      }
    }

    if (!regNoInput) {
      throw new GgrcServiceError('Could not find Registration Number field on GGRC portal.', 'SELECTOR_ERROR', 500);
    }

    // Input the Work Order Number
    await regNoInput.fill(workOrderNumber);
    logger.info(`Filled registration input with: ${workOrderNumber}`);

    // Locate the Search button
    const searchButtonSelectors = [
      'input[type="submit"][value*="Search"]',
      'button[id*="btnSearch"]',
      'input[id*="btnSearch"]',
      'input[value*="Search"]',
      'button:has-text("Search")'
    ];

    let searchButton = null;
    for (const selector of searchButtonSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible().catch(() => false)) {
        searchButton = element;
        logger.info(`Found Search button using selector: ${selector}`);
        break;
      }
    }

    if (!searchButton) {
      throw new GgrcServiceError('Could not find Search button on GGRC portal.', 'SELECTOR_ERROR', 500);
    }

    // Click Search
    logger.info('Clicking search button...');
    await searchButton.click();

    // Check for "Receipt Not Found" or alert messages
    // Sometimes alerts appear, or a panel with error message shows up.
    // Let's set up a listener for browser dialogs first.
    let alertMsg: string | null = null;
    page.once('dialog', async (dialog) => {
      alertMsg = dialog.message();
      logger.warn(`Browser dialog appeared: ${alertMsg}`);
      await dialog.dismiss();
    });

    // Wait for either the download button to appear or a message stating not found
    const downloadButtonSelectors = [
      'a:has-text("Download Payment Receipt")',
      'input[value*="Download Payment Receipt"]',
      'button:has-text("Download Payment Receipt")',
      '[id*="DownloadPaymentReceipt"]',
      '[id*="btnDownload"]',
      '[id*="lnkDownload"]',
      'a:has-text("Download")',
      'input[value*="Download"]'
    ];

    let downloadButton = null;
    const startTime = Date.now();
    const timeout = 15000; // Wait up to 15 seconds for search results

    while (Date.now() - startTime < timeout) {
      if (alertMsg) {
        throw new GgrcServiceError(`GGRC alert: ${alertMsg}`, 'RECEIPT_NOT_FOUND', 404);
      }

      // Check if any error/not found message is visible on the page
      const pageText = await page.innerText('body').catch(() => '');
      if (
        pageText.includes('Record Not Found') || 
        pageText.includes('no record') || 
        pageText.includes('Invalid Registration') ||
        pageText.includes('Not Found')
      ) {
        throw new GgrcServiceError(`Work Order Number ${workOrderNumber} not found in GGRC database.`, 'RECEIPT_NOT_FOUND', 404);
      }

      // Check if download button is visible
      for (const selector of downloadButtonSelectors) {
        const element = page.locator(selector).first();
        if (await element.isVisible().catch(() => false)) {
          downloadButton = element;
          logger.info(`Found Download Payment Receipt button using selector: ${selector}`);
          break;
        }
      }

      if (downloadButton) break;
      await page.waitForTimeout(500);
    }

    if (!downloadButton) {
      throw new GgrcServiceError(
        'Receipt download button did not appear. It may not be ready or the work order number is invalid.',
        'RECEIPT_NOT_FOUND',
        404
      );
    }

    // Intercept and download PDF
    logger.info('Clicking Download Payment Receipt button to retrieve PDF...');
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30000 }).catch((e) => {
        throw new GgrcServiceError('Timeout waiting for receipt download to initiate.', 'DOWNLOAD_TIMEOUT', 408);
      }),
      downloadButton.click()
    ]);

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
