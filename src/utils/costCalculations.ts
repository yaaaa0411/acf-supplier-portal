/**
 * Cost contribution calculations for supplier records.
 *
 * Farmer's Contribution (J) = Total MIS Cost by GGRC (I) - ACF (K) - Company (L) - Govt (M)
 * Total Cost = J + K + L + M (equals Total MIS Cost by GGRC)
 */

export interface CostInputs {
  totalMisCostGgrc: number;
  acfContribution: number;
  companyShare: number;
  governmentContribution: number;
}

export interface CostCalculations {
  farmersContribution: number;
  totalCost: number;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function parseMoneyInput(value: string): number {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateCosts(inputs: CostInputs): CostCalculations {
  const farmersContribution = roundMoney(
    inputs.totalMisCostGgrc -
      inputs.acfContribution -
      inputs.companyShare -
      inputs.governmentContribution
  );

  const totalCost = roundMoney(
    farmersContribution +
      inputs.acfContribution +
      inputs.companyShare +
      inputs.governmentContribution
  );

  return { farmersContribution, totalCost };
}

export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0.00';
  }
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
