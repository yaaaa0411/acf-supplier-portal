const WORK_ORDER_PATTERN = /^\d{4}-(GS|AMR|CTU|JND|AMD)-\d+$/;

/**
 * Validates whether a work order number matches the expected format.
 * Format: YYYY-PREFIX-SEQUENCE (e.g. 2627-GS-565)
 */
export function isValidWorkOrderNumber(workOrderNumber: string): boolean {
  if (!workOrderNumber) return false;
  return WORK_ORDER_PATTERN.test(workOrderNumber.trim());
}
