import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';

interface CrbIndividual {
  individual_id: number;
  surname: string;
  forename1: string;
  forename2?: string;
  forename3?: string;
  gender: string;
  marital_status: string;
  date_of_birth: string;
  nationality: string;
  image?: string;
}

interface CrbNonIndividual {
  non_individual_id: number;
  business_name: string;
  trading_name: string;
  business_type?: string;
  industry?: string;
  date_registered: string;
  activity_description: string;
}

interface CrbSector {
  matches: number;
  sector?: string;
  individuals?: CrbIndividual[];
  nonindividuals?: CrbNonIndividual[];
}

interface KycEnquiryResponse {
  message: string;
  status: number;
  count: number;
  enquiry: {
    id: string;
    entity: string;
    timestamp: string;
    reference: string;
    criteria: string;
    search_value: string;
    identification_type: string;
    status: string;
    cost: number;
    vat: number;
    charge: number;
    formal?: CrbSector | null;
    informal?: CrbSector | null;
  };
}

interface KycEnquiryAttempt {
  id: number;
  clientName: string;
  clientAccount: string;
  validationType: any;
  requestType: any;
  status: any;
  consentStatus: any;
  providerReference: string;
  cost: number;
  responsePayload: string;
  responseDetails?: any;
  createdAt: any;
  completedAt: any;

  parsedResponse?: KycEnquiryResponse | null;
  parseError?: boolean;
}

@Component({
  selector: 'mifosx-kyc-enquiry-tab',
  templateUrl: './kyc-enquiry-tab.component.html',
  styleUrls: ['./kyc-enquiry-tab.component.scss'],
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
export class KycEnquiryTabComponent implements OnInit {

  private route = inject(ActivatedRoute);

  kycEnquiryChecks: KycEnquiryAttempt[] = [];

  constructor() {
    this.route.data.subscribe((data: { kycEnquiryData: KycEnquiryAttempt[] }) => {
      this.kycEnquiryChecks = this.parseKycEnquiryChecks(data.kycEnquiryData || []);
    });
  }

  ngOnInit(): void {}


  private parseKycEnquiryChecks(raw: KycEnquiryAttempt[]): KycEnquiryAttempt[] {
    return raw
      .map((check) => this.parseKycEnquiryCheck(check))
      .sort((a, b) => this.dateValue(b.createdAt) - this.dateValue(a.createdAt));
  }

  private parseKycEnquiryCheck(check: KycEnquiryAttempt): KycEnquiryAttempt {
    try {
      return {
        ...check,
        parsedResponse: check.responsePayload ? JSON.parse(check.responsePayload) : null,
        parseError: false
      };
    } catch (error) {
      console.error('Failed to parse KYC enquiry response', error);
      return { ...check, parsedResponse: null, parseError: true };
    }
  }


  getSectors(response: KycEnquiryResponse): { name: string; icon: string; data: CrbSector }[] {
    if (!response?.enquiry) return [];

    const sectors: { name: string; icon: string; data: CrbSector }[] = [];

    if (response.enquiry.formal) {
      sectors.push({ name: 'Formal Sector', icon: 'business', data: response.enquiry.formal });
    }
    if (response.enquiry.informal) {
      sectors.push({ name: 'Informal Sector', icon: 'storefront', data: response.enquiry.informal });
    }

    return sectors;
  }

  getFullName(person: CrbIndividual): string {
    return [
      person.surname,
      person.forename1,
      person.forename2,
      person.forename3
    ]
      .filter((n) => !!n)
      .join(' ');
  }


  hasItems(items: unknown[] | null | undefined): boolean {
    return Array.isArray(items) && items.length > 0;
  }

  hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  labelOf(value: any): string {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'object') return value.value ?? value.name ?? value.code ?? 'N/A';
    return String(value);
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

  /** Handle string OR LocalDate array [2026,11,18,11,24,31]. */
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

  formatValue(value: unknown): string {
    if (!this.hasValue(value)) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) {
      return value.length ? value.map((v) => this.formatValue(v)).join(', ') : 'N/A';
    }
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  /** Image may be a data URI, base64, or a normal URL. */
  getPhoto(photo?: string | null): string | null {
    if (!photo) return null;
    if (photo.startsWith('data:image/') || photo.startsWith('http')) return photo;
    return `data:image/jpeg;base64,${photo}`;
  }


  get reportCount(): number {
    return this.kycEnquiryChecks.filter((c) => !!c.parsedResponse?.enquiry).length;
  }

  get totalMatches(): number {
    return this.kycEnquiryChecks.reduce((sum, c) => sum + (c.parsedResponse?.count ?? 0), 0);
  }

  get totalCost(): number {
    return this.kycEnquiryChecks.reduce((sum, c) => sum + (c.parsedResponse?.enquiry?.cost ?? 0), 0);
  }

  get latestCheck(): KycEnquiryAttempt | undefined {
    return this.kycEnquiryChecks[0];
  }


  trackByIndex = (index: number) => index;
  trackByCheckId = (_: number, check: KycEnquiryAttempt) => check.id;
  trackByPersonId = (_: number, person: CrbIndividual) => person.individual_id;
  trackByBusinessId = (_: number, biz: CrbNonIndividual) => biz.non_individual_id;
}
