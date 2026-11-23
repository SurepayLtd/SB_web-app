import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrbCreditReportCheck } from '../../../loans/models/loan-account.model';
import {
  CrbConsentDocViewerDialogComponent,
  CrbDocViewerData
} from '../custom-dialogs/crb-consent-doc-viewer-dialog/crb-consent-doc-viewer-dialog.component';
import { LoansService } from '../../../loans/loans.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface KycReportCheck {
  id: number;
  clientId: number;
  clientName: string;
  clientAccount: string;
  loanId: number;

  validationType: { id: number; code: string; value: string };
  requestType: { id: number; code: string; value: string };
  status: { id: number; code: string; value: string };
  consentStatus: { id: number; code: string; value: string } | null;

  responsePayload?: string | null;

  createdAt: number[];
  completedAt: number[];

  reportToken?: string;
  reportUrl?: string;

  responseDetails: Record<string, unknown>;

  // UI-only
  parsedResponse?: KycReportResponse | null;
  parseError?: boolean;
}

export interface KycReportResponse {
  message: string;
  status: number;
  count: number;
  kyc_information: KycInformation;
}

export interface KycInformation {
  identification_details: KycIdentificationDetail[];
  customer_details: KycCustomerDetails | null;
  business_details: KycBusinessDetails | null;
  physical_address_history: KycPhysicalAddress[];
  postal_address_history: KycPostalAddress[];
  contact_history: KycContactHistory | null;
  shareholder_details: KycShareholder[];
  employment_history: KycEmployment[];
}

export interface KycIdentificationDetail {
  SNo: number;
  Identifier: string;
  Identifier_Type: string;
  Country_of_Issue: string;
}

export interface KycCustomerDetails {
  Photo: string;
  Name: string;
  Date_of_Birth: string;
  Marital_Status: string;
  Gender: string;
  Nationality: string;
  Contact: string;
  Address: string;
}

export interface KycBusinessDetails {
  Business_Name: string;
  Trading_Name: string;
  Industry_Sector: string;
  Date_of_Registration: string;
  Postal_Address: string;
  Business_Type: string;
  Contact: string;
  Address: string;
}

export interface KycPhysicalAddress {
  SNo: number;
  Address: string;
  Ownership: string;
  Period_at_Address: string;
}

export interface KycPostalAddress {
  SNo: number;
  address: string;
}

export interface KycContactHistory {
  Phone_Numbers: KycPhoneNumber[];
  Emails: KycEmail[];
}

export interface KycPhoneNumber {
  SNo: number;
  Phone_Number: string;
}

export interface KycEmail {
  SNo: number;
  Email: string;
}

export interface KycShareholder {
  SNo: number;
  Business_Name: string;
  stakeholderType: string;
  Stakeholder_Category: string;
  Shareholder_Percentage: string;
}

export interface KycEmployment {
  SNo: number;
  Employer_Name: string;
  Occupation: string;
  Employment_Date: string;
  Income_Band: string;
}

@Component({
  selector: 'mifosx-kyc-report-tab',
  templateUrl: './kyc-report-tab.component.html',
  styleUrls: ['./kyc-report-tab.component.scss']
})
export class KycReportTabComponent implements OnInit {

  checks: KycReportCheck[] = [];

  constructor(
              private route: ActivatedRoute,
              private loanService: LoansService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar
  ) {
    this.route.data.subscribe((data: { kycReportData: KycReportCheck[] }) => {
      this.checks = this.parseKycReportChecks(data.kycReportData || []);
    });
  }

  ngOnInit(): void {}

  private parseKycReportChecks(raw: KycReportCheck[]): KycReportCheck[] {
    return raw
      .map((check) => this.parseKycReportCheck(check))
      .sort((a, b) => this.dateValue(b.createdAt) - this.dateValue(a.createdAt));
  }

  private parseKycReportCheck(check: KycReportCheck): KycReportCheck {
    if (!check.responsePayload) {
      return { ...check, parsedResponse: null, parseError: false };
    }

    try {
      const parsedResponse =
        typeof check.responsePayload === 'string'
          ? (JSON.parse(check.responsePayload) as KycReportResponse)
          : (check.responsePayload as unknown as KycReportResponse);

      return { ...check, parsedResponse, parseError: false };
    } catch (error) {
      console.error('Failed to parse CRB KYC report response', error);
      return { ...check, parsedResponse: null, parseError: true };
    }
  }

  /** True when the JSON payload contains a full kyc_information body. */
  hasJson(check: KycReportCheck): boolean {
    return !!check.parsedResponse?.kyc_information;
  }

  hasPdf(check: KycReportCheck): boolean {
    return this.hasValue(check.reportUrl);
  }

  openKycReportPdf(check: KycReportCheck): void {
    if (!check?.reportUrl) return;

    const blobUrl$ = this.loanService.getCrbCreditReportPdf(check.id);

    blobUrl$.subscribe({
      next: (response: any) => {
        const blob = this.toBlob(response);
        if (!blob) {
          this.snackBar.open('The kyc report PDF is empty.', 'Close', { duration: 5000 });
          return;
        }

        const blobUrl = URL.createObjectURL(blob) + '#view=FitH';

        const data: CrbDocViewerData = {
          title: 'KYC Report',
          subtitle: `${check.clientName ?? ''}`  || 'KYC report',
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
          error?.error?.defaultUserMessage || 'Failed to load the kyc report PDF.',
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
    if (typeof response === 'string' || response instanceof Uint8Array) {
      return new Blob([response], { type: 'application/pdf' });
    }
    return null;
  }

  /** Friendly download / modal filename. */
  private reportFileName(check: KycReportCheck): string {
    const safe = (check.clientName ?? 'client').replace(/[^a-z0-9]+/gi, '_');
    return `KYC_Report_${safe}_${check.id}.pdf`;
  }

  downloadKycReportPdf(check: KycReportCheck): void {
    if (!check?.reportUrl) return;

    this.loanService.getCrbCreditReportPdf(check.id).subscribe({
      next: (res: any) => {
        const blob = this.toBlob(res);
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.reportFileName(check);
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        this.snackBar.open('Failed to download the KYC report PDF.', 'Close', { duration: 5000 });
      },
    });
  }

  statusLabel(status: { value?: string; code?: string } | string | null | undefined): string {
    if (!status) return 'Unknown';
    return typeof status === 'string' ? status : (status.value ?? status.code ?? 'Unknown');
  }

  statusCode(status: { value?: string; code?: string } | string | null | undefined): string {
    if (!status) return 'unknown';
    const raw = typeof status === 'string' ? status : (status.code ?? status.value ?? '');
    return String(raw).split('.').pop()!.toLowerCase();
  }

  labelOf(value: any): string {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'object') return value.value ?? value.name ?? value.code ?? 'N/A';
    return String(value);
  }

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

  hasItems(items: unknown[] | null | undefined): boolean {
    return Array.isArray(items) && items.length > 0;
  }

  hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  formatValue(value: unknown): string {
    if (!this.hasValue(value)) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) {
      return value.length ? value.map((v) => this.formatValue(v)).join(', ') : 'N/A';
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  /** Photo is a data URI already; fall back to base64 wrapping if raw. */
  getPhoto(photo?: string | null): string | null {
    if (!photo) return null;
    return photo.startsWith('data:image/') ? photo : `data:image/jpeg;base64,${photo}`;
  }

  get reportCount(): number {
    return this.checks.filter((c) => this.hasJson(c)).length;
  }

  get latestCheck(): KycReportCheck | undefined {
    return this.checks[0];
  }


  trackByIndex = (index: number) => index;
  trackByCheckId = (_: number, check: KycReportCheck) => check.id;
}
