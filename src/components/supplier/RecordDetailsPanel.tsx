import type { SupplierRecord } from '../../types';
import { formatMoney } from '../../utils/costCalculations';
import { getFinancialYearLabel } from '../../utils/workOrder';

export interface RecordGeography {
  district?: string | null;
  block?: string | null;
  village?: string | null;
}

interface RecordDetailsPanelProps {
  record: SupplierRecord;
  geography?: RecordGeography;
  compact?: boolean;
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="col-md-4 col-lg-3">
      <div className="small text-muted mb-1">{label}</div>
      <div className="fw-medium">{value ?? '—'}</div>
    </div>
  );
}

/**
 * Displays all supplier record fields including cost contributions.
 */
export function RecordDetailsPanel({ record, geography, compact = false }: RecordDetailsPanelProps) {
  const colClass = compact ? 'col-md-6' : 'col-md-4 col-lg-3';

  return (
    <div className="row g-3">
      <div className={colClass}>
        <div className="small text-muted mb-1">Work Order Number</div>
        <div className="fw-medium">{record.work_order_number}</div>
      </div>
      <div className={colClass}>
        <div className="small text-muted mb-1">Receipt Number</div>
        <div className="fw-medium">{record.receipt_number ?? '—'}</div>
      </div>
      <div className={colClass}>
        <div className="small text-muted mb-1">Financial Year</div>
        <div className="fw-medium">{getFinancialYearLabel(record.year)}</div>
      </div>
      <div className={colClass}>
        <div className="small text-muted mb-1">Farmer / MIS Supplier Name</div>
        <div className="fw-medium">{record.mis_supplier_name}</div>
      </div>

      {geography && (
        <>
          <DetailItem label="District" value={geography.district} />
          <DetailItem label="Taluka / Block" value={geography.block} />
          <DetailItem label="Village" value={geography.village} />
        </>
      )}

      <DetailItem
        label="Date of Application"
        value={new Date(record.date_of_application).toLocaleDateString('en-IN')}
      />
      <DetailItem
        label="Area (Ha)"
        value={record.area_ha != null ? record.area_ha.toFixed(2) : '—'}
      />
      <DetailItem label="Type of MIS" value={record.type_of_mis} />
      <DetailItem label="Crop" value={record.crop} />
      <DetailItem label="Farmer Mobile No." value={record.farmer_mobile_no} />

      <div className="col-12">
        <hr className="my-1" />
        <h6 className="fw-bold small text-uppercase text-muted mb-0">Cost Contribution Details</h6>
      </div>

      <DetailItem label="Total MIS Cost by GGRC" value={`₹${formatMoney(record.total_mis_cost_ggrc)}`} />
      <DetailItem label="Farmer's Contribution" value={`₹${formatMoney(record.farmers_contribution)}`} />
      <DetailItem label="ACF's Contribution" value={`₹${formatMoney(record.acf_contribution)}`} />
      <DetailItem label="Company Share" value={`₹${formatMoney(record.company_share)}`} />
      <DetailItem label="Government Contribution" value={`₹${formatMoney(record.government_contribution)}`} />
      <DetailItem label="Total Cost" value={`₹${formatMoney(record.total_cost)}`} />
    </div>
  );
}
