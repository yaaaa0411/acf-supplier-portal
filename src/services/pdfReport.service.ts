import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatMoney } from '../utils/costCalculations';
import { getFinancialYearLabel } from '../utils/workOrder';
import type { ReportRecord } from './report.service';

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 15;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getLatestRemark(record: ReportRecord & { remarks?: string }): string {
  return record.remarks ?? '—';
}

/**
 * Render a single supplier report page onto the PDF document.
 */
function renderReportPage(doc: jsPDF, record: ReportRecord, remarksText: string, isFirstPage: boolean) {
  if (!isFirstPage) {
    doc.addPage();
  }

  let y = MARGIN;

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('AMBUJA CEMENT FOUNDATION', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Corporate Office: Ahura Centre, 3rd Floor, Mahakali Caves Road, Andheri (East), Mumbai - 400 093', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 5;
  doc.text('Email: acf@ambujacement.com  |  Website: www.ambujacementfoundation.org', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 8;

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('WORK ORDER / PAYMENT VOUCHER', PAGE_WIDTH / 2, y, { align: 'center' });
  y += 8;

  // ── Budget Head & FY ────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Budget Head:', MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Micro Irrigation System (MIS) Support to Farmers', MARGIN + 28, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Year:', PAGE_WIDTH - MARGIN - 45, y);
  doc.setFont('helvetica', 'normal');
  doc.text(getFinancialYearLabel(record.year), PAGE_WIDTH - MARGIN, y, { align: 'right' });
  y += 8;

  // ── Farmer Details Table ──────────────────────────────────────────────────
  const farmerDetails: [string, string][] = [
    ['Farmer Name', record.mis_supplier_name || '—'],
    ['Village', record.villages?.name ?? '—'],
    ['Taluka / Block', record.blocks?.name ?? '—'],
    ['District', record.districts?.name ?? '—'],
    ['Receipt Number', record.receipt_number ?? '—'],
    ['Work Order Number', record.work_order_number || '—'],
    ['Date of Application', formatDate(record.date_of_application)],
    ['Area (Ha)', record.area_ha != null ? record.area_ha.toFixed(2) : '—'],
    ['Type of MIS', record.type_of_mis ?? '—'],
    ['Crop', record.crop ?? '—'],
    ['Farmer Mobile No.', record.farmer_mobile_no ?? '—'],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Particulars', 'Details']],
    body: farmerDetails,
    theme: 'grid',
    margin: { left: MARGIN, right: MARGIN },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 55, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── Cost Breakdown Table ──────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Cost Contribution Details', MARGIN, y);
  y += 4;

  const costRows: [string, string][] = [
    ['Total MIS Cost by GGRC', formatMoney(record.total_mis_cost_ggrc)],
    ["Farmer's Contribution", formatMoney(record.farmers_contribution)],
    ["ACF's Contribution", formatMoney(record.acf_contribution)],
    ['Company Share', formatMoney(record.company_share)],
    ['Government Contribution', formatMoney(record.government_contribution)],
    ['Total Cost', formatMoney(record.total_cost)],
  ];

  autoTable(doc, {
    startY: y,
    head: [['Description', 'Amount (Rs.)']],
    body: costRows,
    theme: 'grid',
    margin: { left: MARGIN, right: MARGIN },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.row.index === costRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [245, 245, 245];
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // ── Remarks ───────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Remarks:', MARGIN, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const remarkLines = doc.splitTextToSize(remarksText || '—', PAGE_WIDTH - 2 * MARGIN);
  doc.text(remarkLines, MARGIN, y);
  y += remarkLines.length * 4 + 10;

  // ── Signature Section ─────────────────────────────────────────────────────
  const sigY = Math.max(y, PAGE_HEIGHT - 45);
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);

  const sigColWidth = (PAGE_WIDTH - 2 * MARGIN) / 3;

  for (let i = 0; i < 3; i++) {
    const x = MARGIN + i * sigColWidth + sigColWidth / 2;
    doc.line(x - 25, sigY, x + 25, sigY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const labels = ['Prepared By', 'Verified By', 'Approved By'];
    doc.text(labels[i], x, sigY + 5, { align: 'center' });
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(
    'This is a computer-generated document from the ACF Supplier Portal.',
    PAGE_WIDTH / 2,
    PAGE_HEIGHT - 8,
    { align: 'center' }
  );
  doc.setTextColor(0);
}

export interface ReportWithRemarks extends ReportRecord {
  remarksText?: string;
}

/**
 * Generate a multi-page PDF with one report page per supplier record.
 */
export function generateSupplierReportsPdf(
  records: ReportWithRemarks[]
): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  records.forEach((record, index) => {
    renderReportPage(doc, record, record.remarksText ?? '—', index === 0);
  });

  return doc;
}

/**
 * Generate and download the supplier reports PDF.
 */
export function downloadSupplierReportsPdf(
  records: ReportWithRemarks[],
  filename = 'supplier-reports.pdf'
): void {
  const doc = generateSupplierReportsPdf(records);
  doc.save(filename);
}

export { getLatestRemark };
