import { useMemo } from 'react';
import { calculateCosts, formatMoney, parseMoneyInput } from '../../utils/costCalculations';

export interface CostFieldValues {
  totalMisCostGgrc: string;
  acfContribution: string;
  companyShare: string;
  governmentContribution: string;
}

interface CostFieldsProps {
  values: CostFieldValues;
  onChange: (values: CostFieldValues) => void;
  disabled?: boolean;
  idPrefix?: string;
}

/**
 * Shared cost contribution fields with automatic Farmer's Contribution and Total Cost.
 */
export function CostFields({ values, onChange, disabled = false, idPrefix = '' }: CostFieldsProps) {
  const calculations = useMemo(() => {
    return calculateCosts({
      totalMisCostGgrc: parseMoneyInput(values.totalMisCostGgrc),
      acfContribution: parseMoneyInput(values.acfContribution),
      companyShare: parseMoneyInput(values.companyShare),
      governmentContribution: parseMoneyInput(values.governmentContribution),
    });
  }, [values]);

  const updateField = (field: keyof CostFieldValues, value: string) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <>
      <div className="mb-3">
        <label htmlFor={`${idPrefix}total-mis-cost`} className="form-label fw-medium">
          Total MIS Cost by GGRC <span className="text-danger">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text">₹</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            id={`${idPrefix}total-mis-cost`}
            placeholder="0.00"
            value={values.totalMisCostGgrc}
            onChange={(e) => updateField('totalMisCostGgrc', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`${idPrefix}acf-contribution`} className="form-label fw-medium">
          ACF&apos;s Contribution <span className="text-danger">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text">₹</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            id={`${idPrefix}acf-contribution`}
            placeholder="0.00"
            value={values.acfContribution}
            onChange={(e) => updateField('acfContribution', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`${idPrefix}company-share`} className="form-label fw-medium">
          Company Share <span className="text-danger">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text">₹</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            id={`${idPrefix}company-share`}
            placeholder="0.00"
            value={values.companyShare}
            onChange={(e) => updateField('companyShare', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`${idPrefix}govt-contribution`} className="form-label fw-medium">
          Government Contribution <span className="text-danger">*</span>
        </label>
        <div className="input-group">
          <span className="input-group-text">₹</span>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            id={`${idPrefix}govt-contribution`}
            placeholder="0.00"
            value={values.governmentContribution}
            onChange={(e) => updateField('governmentContribution', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`${idPrefix}farmers-contribution`} className="form-label fw-medium">
          Farmer&apos;s Contribution
          <span className="badge bg-secondary ms-2">Auto Calculated</span>
        </label>
        <div className="input-group">
          <span className="input-group-text">₹</span>
          <input
            type="text"
            className="form-control bg-light"
            id={`${idPrefix}farmers-contribution`}
            value={formatMoney(calculations.farmersContribution)}
            readOnly
            tabIndex={-1}
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor={`${idPrefix}total-cost`} className="form-label fw-medium">
          Total Cost
          <span className="badge bg-secondary ms-2">Auto Calculated</span>
        </label>
        <div className="input-group">
          <span className="input-group-text">₹</span>
          <input
            type="text"
            className="form-control bg-light"
            id={`${idPrefix}total-cost`}
            value={formatMoney(calculations.totalCost)}
            readOnly
            tabIndex={-1}
          />
        </div>
      </div>
    </>
  );
}

export function getCalculatedCostValues(values: CostFieldValues) {
  const calculations = calculateCosts({
    totalMisCostGgrc: parseMoneyInput(values.totalMisCostGgrc),
    acfContribution: parseMoneyInput(values.acfContribution),
    companyShare: parseMoneyInput(values.companyShare),
    governmentContribution: parseMoneyInput(values.governmentContribution),
  });

  return {
    total_mis_cost_ggrc: parseMoneyInput(values.totalMisCostGgrc),
    acf_contribution: parseMoneyInput(values.acfContribution),
    company_share: parseMoneyInput(values.companyShare),
    government_contribution: parseMoneyInput(values.governmentContribution),
    farmers_contribution: calculations.farmersContribution,
    total_cost: calculations.totalCost,
  };
}

export function costValuesFromRecord(record: {
  total_mis_cost_ggrc?: number | null;
  acf_contribution?: number | null;
  company_share?: number | null;
  government_contribution?: number | null;
}): CostFieldValues {
  return {
    totalMisCostGgrc: record.total_mis_cost_ggrc?.toString() ?? '',
    acfContribution: record.acf_contribution?.toString() ?? '',
    companyShare: record.company_share?.toString() ?? '',
    governmentContribution: record.government_contribution?.toString() ?? '',
  };
}
