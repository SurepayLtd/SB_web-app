/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../clients.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type ValidationGroup = 'details' | 'nin' | 'phone';

interface ValidationBlock {
  id?: string;
  reference?: string;
  timestamp?: string;
  status?: string;
  message?: string | null;
  error_message?: string | null;

  // NIN / Details
  nin?: string;
  nin_status?: string;
  matching_status?: string;
  card_status?: string;
  document_id?: string;
  surname?: string;
  given_name?: string | null;
  other_name?: string | null;
  name?: string;
  date_of_birth?: string;

  // Phone
  phonenumber?: string;
  firstname?: string;
  middlename?: string;
  phone_status?: string;

  cost?: string | number;
  vat?: string | number;
  currency?: string;
}

interface ParsedPayload {
  message?: string;
  status?: number;
  count?: number;
  validation?: ValidationBlock;
}

interface ExtraField {
  key: string;
  label: string;
  value: unknown;
}

@Component({
  selector: 'mifosx-crb-checks-tab',
  templateUrl: './crb-checks-tab.component.html',
  styleUrls: ['./crb-checks-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatTabsModule,
    MatProgressSpinnerModule
  ]
})
export class CrbChecksTabComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private clientService = inject(ClientsService);
  private snackBar = inject(MatSnackBar);

  clientId: string;
  checks: any[] = [];

  loading = false;
  loaded = false;
  errorMessage = '';

  /** Keys already rendered by the typed sections — everything else goes to "Additional Fields". */
  private readonly KNOWN_VALIDATION_KEYS = new Set<string>([
    // envelope
    'id', 'reference', 'timestamp', 'status', 'message', 'error_message',
    'cost', 'vat', 'currency',
    // NIN / details
    'nin', 'nin_status', 'matching_status', 'card_status',
    'document_id', 'surname', 'given_name', 'other_name', 'name', 'date_of_birth',
    // phone
    'phonenumber', 'firstname', 'middlename', 'phone_status',
  ]);

  constructor() {
    this.route.data.subscribe((data: { checks: any }) => {
      this.checks = this.sortChecks(data.checks ?? []);
      this.clientId = this.route.parent.snapshot.paramMap.get('clientId');
    });
  }

  ngOnInit(): void {
    this.refreshHistory();
  }

  refreshHistory(): void {
    if (!this.clientId) return;

    this.loading = true;
    this.errorMessage = '';

    this.clientService.getCrbCheckHistory(this.clientId).subscribe({
      next: (response: any) => {
        const records = Array.isArray(response) ? response : response?.pageItems ?? [];
        this.checks = this.sortChecks(records);
        this.loading = false;
        this.loaded = true;
      },
      error: () => {
        this.loading = false;
        this.loaded = true;
        this.errorMessage = 'Unable to load CRB verification history.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      },
    });
  }


  get detailsChecks() { return this.filterByType('details'); }
  get ninChecks()     { return this.filterByType('nin'); }
  get phoneChecks()   { return this.filterByType('phone'); }

  get latestChecks() {
    const groups: ValidationGroup[] = ['details', 'nin', 'phone'];
    return groups
      .map((group) => this.filterByType(group)[0])
      .filter((check) => !!check);
  }

  filterByType(type: ValidationGroup): any[] {
    return this.checks.filter((check) => this.groupOf(check) === type);
  }

  groupOf(check: any): ValidationGroup | null {
    const value = (check?.validationType?.value ?? '').toLowerCase();

    if (value.includes('phone')) return 'phone';
    if (value.includes('nin'))   return 'nin';
    if (value.includes('customer details') || value.includes('personal details')) return 'details';

    return null;
  }


  get latestConsentStatus(): string {
    return this.checks.find((c) => c.consentStatus?.value)?.consentStatus?.value
      ?? 'Not available';
  }

  get totalCost(): number {
    return this.checks.reduce((sum, c) => sum + Number(c.cost ?? 0), 0);
  }

  get verifiedCount(): number {
    return this.checks.filter(
      (c) => (c.status?.value ?? '').toLowerCase() === 'verified'
    ).length;
  }

  get currency(): string {
    return this.checks[0]?.currency ?? 'UGX';
  }


  parseResponsePayload(check: any): ParsedPayload | null {
    if (!check?.responsePayload) return null;
    try {
      return typeof check.responsePayload === 'string'
        ? (JSON.parse(check.responsePayload) as ParsedPayload)
        : (check.responsePayload as ParsedPayload);
    } catch {
      return null;
    }
  }

  validationOf(check: any): ValidationBlock | null {
    return this.parseResponsePayload(check)?.validation ?? null;
  }

  attemptMessage(check: any): string | null {
    return check?.message ?? this.parseResponsePayload(check)?.message ?? null;
  }

  /** Any `validation` keys the typed sections don't already render. */
  extraValidationFields(check: any): ExtraField[] {
    const v = this.validationOf(check) as Record<string, unknown> | null;
    if (!v) return [];

    return Object.keys(v)
      .filter((k) => !this.KNOWN_VALIDATION_KEYS.has(k))
      .filter((k) => v[k] !== null && v[k] !== undefined && v[k] !== '')
      .sort((a, b) => a.localeCompare(b))
      .map((k) => ({
        key: k,
        label: this.humaniseKey(k),
        value: v[k],
      }));
  }


  attemptStatusClass(check: any): string {
    const label = (check?.status?.value ?? '').toLowerCase();
    switch (label) {
      case 'verified':   return 'status-success';
      case 'failed':
      case 'rejected':
      case 'error':      return 'status-failed';
      case 'pending':
      case 'processing': return 'status-pending';
      default:           return 'status-neutral';
    }
  }

  resultStatusClass(value?: string | null): string {
    switch ((value ?? '').toUpperCase()) {
      case 'VALID':
      case 'FOUND':
      case 'YES':
      case 'SUCCESSFUL': return 'status-success';
      case 'NOT FOUND':
      case 'INVALID':
      case 'NO':
      case 'FAILED':     return 'status-failed';
      case 'PENDING':    return 'status-pending';
      default:           return 'status-neutral';
    }
  }


  formatDate(value?: number[] | string): string {
    const date = this.toDate(value);
    return date ? date.toLocaleString() : '—';
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

  formatCost(check: any): string {
    if (check?.cost == null) return '—';
    const amount = Number(check.cost).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${check.currency ?? ''} ${amount}`.trim();
  }

  /** 'response_code' → 'Response Code' */
  humaniseKey(key: string): string {
    return key
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /** Safe rendering for any unknown value — no [object Object]. */
  formatUnknown(value: unknown): string {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) {
      return value.length ? value.map((v) => this.formatUnknown(v)).join(', ') : '—';
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, val]) => `${this.humaniseKey(k)}: ${this.formatUnknown(val)}`)
        .join(' · ');
    }
    return String(value);
  }


  trackByIndex = (index: number) => index;
  trackByCheckId = (_: number, check: any) => check.id;
  trackByFieldKey = (_: number, field: ExtraField) => field.key;

  private sortChecks(records: any[]): any[] {
    return [...records].sort(
      (a, b) => this.toTimestamp(b.createdAt) - this.toTimestamp(a.createdAt)
    );
  }

  private toTimestamp(value?: number[] | string): number {
    return this.toDate(value)?.getTime() ?? 0;
  }
}
