import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  GGRC_URL: process.env.GGRC_URL || 'https://portal.ggrc.co.in/PaymentPortal/MISPayment.aspx',
  REQUEST_TIMEOUT_MS: parseInt(process.env.REQUEST_TIMEOUT_MS || '60000', 10),
  BULLSEYE_PLAYWRIGHT_HEADLESS: process.env.BULLSEYE_PLAYWRIGHT_HEADLESS !== 'false',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
