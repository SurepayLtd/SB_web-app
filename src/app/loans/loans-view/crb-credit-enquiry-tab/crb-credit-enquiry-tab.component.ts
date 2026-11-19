import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CrbIndividualData,
  CrbSectorData,
  CreditEnquiryCheck,
  CreditEnquiryResponse,
} from '../../models/loan-account.model';

/** A sector row used by the template, with stable identification. */
interface SectorView {
  kind: 'formal' | 'informal';
  name: string;
  icon: string;
  data: CrbSectorData;
}

@Component({
  selector: 'mifosx-crb-credit-enquiry-tab',
  templateUrl: './crb-credit-enquiry-tab.component.html',
  styleUrls: ['./crb-credit-enquiry-tab.component.scss'],
})
export class CrbCreditEnquiryTabComponent implements OnInit {

  creditEnquiryChecks: CreditEnquiryCheck[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { creditEnquiryData: CreditEnquiryCheck[] }) => {
      this.creditEnquiryChecks = this.parseCreditEnquiryChecks(data.creditEnquiryData || []);
    });
  }

  ngOnInit(): void {}


  private parseCreditEnquiryChecks(raw: CreditEnquiryCheck[]): CreditEnquiryCheck[] {
    return raw
      .map((check) => this.parseCreditEnquiryCheck(check))
      .sort((a, b) => this.dateValue(b.createdAt) - this.dateValue(a.createdAt));
  }

  private parseCreditEnquiryCheck(check: CreditEnquiryCheck): CreditEnquiryCheck {
    if (!check.responsePayload) {
      return { ...check, parsedResponse: null, parseError: false };
    }
    try {
      return {
        ...check,
        parsedResponse: JSON.parse(check.responsePayload),
        parseError: false,
      };
    } catch (error) {
      console.error('Failed to parse CRB credit enquiry response', error);
      return { ...check, parsedResponse: null, parseError: true };
    }
  }


  getSectors(response: CreditEnquiryResponse): SectorView[] {
    const enquiry = response?.enquiry;
    if (!enquiry) return [];

    const sectors: SectorView[] = [];

    if (enquiry.formal) {
      sectors.push({
        kind: 'formal',
        name: 'Formal Sector',
        icon: 'business',
        data: enquiry.formal,
      });
    }
    if (enquiry.informal) {
      sectors.push({
        kind: 'informal',
        name: 'Informal Sector',
        icon: 'storefront',
        data: enquiry.informal,
      });
    }
    return sectors;
  }

  getIndividualFullName(person: CrbIndividualData): string {
    return [person.surname, person.forename1, person.forename2, person.forename3]
      .filter((n) => !!n)
      .join(' ');
  }


  get latestCheck(): CreditEnquiryCheck | undefined {
    return this.creditEnquiryChecks[0];
  }

  get totalMatches(): number {
    return this.creditEnquiryChecks.reduce((sum, c) => {
      const f = c.parsedResponse?.enquiry?.formal?.matches ?? 0;
      const i = c.parsedResponse?.enquiry?.informal?.matches ?? 0;
      return sum + f + i;
    }, 0);
  }

  get totalCost(): number {
    return this.creditEnquiryChecks.reduce((sum, c) => sum + Number(c.cost ?? 0), 0);
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

  /** Provider-level status (e.g. "SUCCESSFUL") → css class. */
  providerStatusCode(value?: string | null): string {
    switch ((value ?? '').toUpperCase()) {
      case 'SUCCESSFUL':
      case 'SUCCESS':   return 'status-success';
      case 'FAILED':
      case 'ERROR':     return 'status-failed';
      case 'PENDING':   return 'status-pending';
      default:          return 'status-neutral';
    }
  }


  formatDate(value?: number[] | string): string {
    const date = this.toDate(value);
    return date ? date.toLocaleString() : 'N/A';
  }

  toDate(value?: number[] | string): Date | null {
    if (!value) return null;
    if (Array.isArray(value)) {
      const [y, m, d, h = 0, min = 0, s = 0] = value;
      const date = new Date(y, m - 1, d, h, min, s);
      return isNaN(date.getTime()) ? null : date;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  private dateValue(value?: number[] | string): number {
    return this.toDate(value)?.getTime() ?? 0;
  }

  formatNumber(value?: number | null): string {
    if (value === null || value === undefined) return '0.00';
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }


  trackByIndex = (index: number) => index;
  trackByCheckId = (_: number, c: CreditEnquiryCheck) => c.id;
  trackByIndividualId = (_: number, p: CrbIndividualData) => p.individual_id;
  trackByBusinessId = (_: number, b: any) => b.non_individual_id;
}
