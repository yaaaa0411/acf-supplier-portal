import type { WorkOrderPrefix } from '../types';

/**
 * Derive Indian financial year code (e.g. 2526 for FY 2025-2026).
 * Financial year runs April to March.
 */
export function getFinancialYearCode(date: Date = new Date()): string {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return String(startYear).slice(-2) + String(endYear).slice(-2);
}

export function getFinancialYearLabel(code: string): string {
  if (code.length !== 4) return code;
  const start = parseInt(code.slice(0, 2), 10);
  const end = parseInt(code.slice(2, 4), 10);
  const century = new Date().getFullYear().toString().slice(0, 2);
  return `${century}${String(start).padStart(2, '0')}–${century}${String(end).padStart(2, '0')}`;
}

const WORK_ORDER_PATTERN = /^(\d{4})-(GS|AML|CTU|JND)-(\d+)$/;

export interface ParsedWorkOrder {
  financialYear: string;
  prefix: WorkOrderPrefix;
  sequence: string;
  full: string;
}

/** Parse new-format work order: 2526-GS-2704 */
export function parseWorkOrderNumber(workOrderNumber: string): ParsedWorkOrder | null {
  const match = workOrderNumber.match(WORK_ORDER_PATTERN);
  if (!match) return null;

  return {
    financialYear: match[1],
    prefix: match[2] as WorkOrderPrefix,
    sequence: match[3],
    full: workOrderNumber,
  };
}

/** Parse legacy format (GS12345) or new format */
export function parseWorkOrderPrefix(workOrderNumber: string): {
  prefix: WorkOrderPrefix;
  displayNumber: string;
} {
  const parsed = parseWorkOrderNumber(workOrderNumber);
  if (parsed) {
    return { prefix: parsed.prefix, displayNumber: workOrderNumber };
  }

  const prefixes: WorkOrderPrefix[] = ['GS', 'AML', 'CTU', 'JND'];
  for (const p of prefixes) {
    if (workOrderNumber.startsWith(p)) {
      return {
        prefix: p,
        displayNumber: workOrderNumber.substring(p.length),
      };
    }
  }

  return { prefix: 'GS', displayNumber: workOrderNumber };
}

/** Extract receipt number from work order (sequential suffix) */
export function extractReceiptNumber(workOrderNumber: string): string {
  const parsed = parseWorkOrderNumber(workOrderNumber);
  if (parsed) return parsed.sequence.padStart(4, '0');
  return workOrderNumber;
}
