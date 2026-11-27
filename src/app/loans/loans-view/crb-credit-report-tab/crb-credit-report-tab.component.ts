import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CrbCreditReportCheck,
  CreditReportJsonResponse,
} from '../../models/loan-account.model';
import { LoansService } from '../../loans.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  CrbConsentDocViewerDialogComponent,
  CrbDocViewerData
} from 'app/clients/clients-view/custom-dialogs/crb-consent-doc-viewer-dialog/crb-consent-doc-viewer-dialog.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'mifosx-crb-credit-report-tab',
  templateUrl: './crb-credit-report-tab.component.html',
  styleUrls: ['./crb-credit-report-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatDialogModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatIcon,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ]
})
export class CrbCreditReportTabComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private loanService = inject(LoansService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  checks: CrbCreditReportCheck[] = [];

  constructor() {
    this.route.data.subscribe((data: { creditReportData: CrbCreditReportCheck[] }) => {
      this.checks = this.parseCreditReportChecks(data.creditReportData || []);
    });
  }

  ngOnInit(): void {}


  private parseCreditReportChecks(raw: CrbCreditReportCheck[]): CrbCreditReportCheck[] {
    return raw
      .map((check) => this.parseCreditReportCheck(check))
      .sort((a, b) => this.dateValue(b.createdAt) - this.dateValue(a.createdAt));
  }

  private parseCreditReportCheck(check: CrbCreditReportCheck): CrbCreditReportCheck {
    if (!check.responsePayload) {
      return { ...check, parsedResponse: null, parseError: false };
    }
    try {
      const parsedResponse = JSON.parse(check.responsePayload) as CreditReportJsonResponse;
      return { ...check, parsedResponse, parseError: false };
    } catch (error) {
      console.error('Failed to parse CRB credit report response', error);
      return { ...check, parsedResponse: null, parseError: true };
    }
  }


  hasPdf(check: CrbCreditReportCheck): boolean {
    return this.hasValue(check.reportUrl);
  }

  hasJson(check: CrbCreditReportCheck): boolean {
    return !!check.parsedResponse?.credit_information;
  }

  openCreditReportPdf(check: CrbCreditReportCheck): void {
    if (!check?.reportUrl) return;

    const blobUrl$ = this.loanService.getCrbCreditReportPdf(check.id);

    blobUrl$.subscribe({
      next: (response: any) => {
        const blob = this.toBlob(response);
        if (!blob) {
          this.snackBar.open('The credit report PDF is empty.', 'Close', { duration: 5000 });
          return;
        }

        const blobUrl = URL.createObjectURL(blob) + '#view=FitH';

        const data: CrbDocViewerData = {
          title: 'CRB Credit Report',
          subtitle: `${check.clientName ?? ''} · ${check.loanAccount ?? ''}`.trim() || 'Credit report',
          blobUrl,
          fileName: this.reportFileName(check),
        };

        const ref = this.dialog.open(CrbConsentDocViewerDialogComponent, {
          width: '95vw',
          maxWidth: '95vw',
          height: '95vh',
          maxHeight: '95vh',
          panelClass: 'crb-doc-viewer-panel',
          data,
        });

        // Free memory as soon as the modal closes
        ref.afterClosed().subscribe(() => URL.revokeObjectURL(blobUrl));
      },
      error: (error) => {
        this.snackBar.open(
          error?.error?.defaultUserMessage || 'Failed to load the credit report PDF.',
          'Close',
          { duration: 5000 }
        );
      },
    });
  }

  /** Normalise a service response into a Blob (handles Blob, ArrayBuffer, string). */
  private toBlob(response: any): Blob | null {
    if (response instanceof Blob) return response;
    if (response instanceof ArrayBuffer) {
      return new Blob([response], { type: 'application/pdf' });
    }
    if (typeof response === 'string') {
      return new Blob([response], { type: 'application/pdf' });
    }

    if (response instanceof Uint8Array) {
      const buffer = new ArrayBuffer(response.byteLength);
      new Uint8Array(buffer).set(response);

      return new Blob([buffer], { type: 'application/pdf' });
    }
    return null;
  }

  /** Friendly download / modal filename. */
  private reportFileName(check: CrbCreditReportCheck): string {
    const safe = (check.clientName ?? 'client').replace(/[^a-z0-9]+/gi, '_');
    return `CRB_Credit_Report_${safe}_${check.id}.pdf`;
  }

  downloadCreditReportPdf(check: CrbCreditReportCheck): void {
    if (!check?.reportUrl) return;

    this.loanService.getCrbCreditReportPdf(check.id).subscribe({
      next: (response: any) => {
        const blob = this.toBlob(response);
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.reportFileName(check);
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        this.snackBar.open('Failed to download the credit report PDF.', 'Close', { duration: 5000 });
      },
    });
  }

  statusLabel(status: any): string {
    if (!status) return 'Unknown';
    return typeof status === 'string' ? status : (status.value ?? status.code ?? 'Unknown');
  }

  statusCode(status: any): string {
    if (!status) return 'unknown';
    const raw = typeof status === 'string' ? status : (status.code ?? status.value ?? '');
    return String(raw).split('.').pop()!.toLowerCase();
  }

  labelOf(value: any): string {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'object') return value.value ?? value.name ?? value.code ?? 'N/A';
    return String(value);
  }


  /** Handles ISO strings AND LocalDate arrays like [2026, 11, 17, 16, 55, 7]. */
  toDate(value: unknown): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }
    if (Array.isArray(value) && value.length >= 3) {
      const [y, m, d, h = 0, min = 0, s = 0] = value as number[];
      return new Date(y, m - 1, d, h, min, s);
    }
    return null;
  }

  private dateValue(value: unknown): number {
    return this.toDate(value)?.getTime() ?? 0;
  }


  hasRows(rows?: unknown[] | null): boolean {
    return Array.isArray(rows) && rows.length > 0;
  }

  hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  /** Primitive (or null) — rendered inline in a table cell. */
  isScalar(value: unknown): boolean {
    return value === null
      || value === undefined
      || typeof value === 'string'
      || typeof value === 'number'
      || typeof value === 'boolean';
  }

  /** Array of objects — rendered as a nested sub-table. */
  isNestedTable(value: unknown): value is Record<string, unknown>[] {
    return Array.isArray(value)
      && value.length > 0
      && typeof value[0] === 'object'
      && value[0] !== null;
  }


  /** snake_case / kebab-case → "Human Readable". */
  humaniseKey(key: string): string {
    return key
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /** Renders scalars correctly. Objects are flattened (no JSON.stringify). */
  formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return String(value);
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      return value.length ? value.map((v) => this.formatValue(v)).join(', ') : 'N/A';
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${this.humaniseKey(k)}: ${this.formatValue(v)}`)
        .join(' · ');
    }
    return String(value);
  }

  /** Column keys for a nested table of any row shape. */
  columnsOf(rows?: readonly object[] | null): string[] {
    if (!rows?.length) return [];
    const keys = new Set<string>();
    rows.forEach((row) => Object.keys(row ?? {}).forEach((k) => keys.add(k)));
    return Array.from(keys);
  }

  /** Read a cell by key from a row of any shape. */
  cellValue(row: object, col: string): unknown {
    return (row as Record<string, unknown>)[col];
  }


  get reportCount(): number {
    return this.checks.filter((c) => this.hasJson(c)).length;
  }

  get pdfOnlyCount(): number {
    return this.checks.filter((c) => this.hasPdf(c) && !this.hasJson(c)).length;
  }

  get latestCheck(): CrbCreditReportCheck | undefined {
    return this.checks[0];
  }

  trackByIndex = (index: number) => index;
  trackByCheckId = (_: number, check: CrbCreditReportCheck) => check.id;
}
