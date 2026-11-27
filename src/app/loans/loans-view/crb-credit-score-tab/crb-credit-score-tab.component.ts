import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CrbScore,
  CreditApplicationSummary,
  CreditScoreAttempt,
  MnoScore,
} from '../../models/loan-account.model';
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

/** A flattened score-history row for the template. */
interface ScoreHistoryRow {
  period: string;
  value: number;
}

/** A flattened MNO phone number for the template. */
interface MnoPhoneRow {
  msisdn: string;
  status: string;
}

@Component({
  selector: 'mifosx-crb-credit-score-tab',
  templateUrl: './crb-credit-score-tab.component.html',
  styleUrls: ['./crb-credit-score-tab.component.scss'],
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
export class CrbCreditScoreTabComponent implements OnInit {
  private route = inject(ActivatedRoute);

  creditScoreAttempts: CreditScoreAttempt[] = [];

  constructor() {
    this.route.data.subscribe((data: { creditScoreData: CreditScoreAttempt[] }) => {
      this.creditScoreAttempts = this.parseCreditScoreChecks(data.creditScoreData || []);
    });
  }

  ngOnInit(): void {}


  private parseCreditScoreChecks(raw: CreditScoreAttempt[]): CreditScoreAttempt[] {
    return raw
      .map((check) => this.parseCreditScoreCheck(check))
      .sort((a, b) => this.dateValue(b.createdAt) - this.dateValue(a.createdAt));
  }

  private parseCreditScoreCheck(check: CreditScoreAttempt): CreditScoreAttempt {
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
      console.error('Failed to parse CRB credit score response', error);
      return { ...check, parsedResponse: null, parseError: true };
    }
  }


  getScore(attempt: CreditScoreAttempt): CrbScore | null {
    return attempt.parsedResponse?.data?.CRB ?? null;
  }

  getMnoScore(attempt: CreditScoreAttempt): MnoScore | null {
    return attempt.parsedResponse?.data?.MNO ?? null;
  }

  hasAnyScore(attempt: CreditScoreAttempt): boolean {
    return !!this.getScore(attempt) || !!this.getMnoScore(attempt);
  }

  hasProviderError(attempt: CreditScoreAttempt): boolean {
    return !!(
      attempt.parsedResponse?.data?.CRB?.Errors ||
      attempt.parsedResponse?.data?.MNO?.Errors
    );
  }


  getHistory(score: CrbScore): ScoreHistoryRow[] {
    const history = score.Scoring?.History_Max_12Months;
    if (!history) return [];

    return Object.keys(history)
      .sort((a, b) => b.localeCompare(a))
      .map((period) => ({ period, value: history[period] }));
  }

  /** Flatten phone numbers from MNO.Customer.Phone_Numbers for the template. */
  getMnoPhones(mno: MnoScore): MnoPhoneRow[] {
    const phones = mno.Customer?.Phone_Numbers ?? [];
    return phones.map((p) => ({
      msisdn: p.msisdn ?? '—',
      status: p.status ?? '—',
    }));
  }


  getApplicationTotal(applications?: CreditApplicationSummary[]): number {
    if (!applications?.length) return 0;
    return applications.reduce((sum, a) => sum + (a.Count ?? 0), 0);
  }

  getApplicationValue(applications?: CreditApplicationSummary[]): number {
    if (!applications?.length) return 0;
    return applications.reduce((sum, a) => sum + (a.Value ?? 0), 0);
  }

  getApplicationCurrency(applications?: CreditApplicationSummary[]): string | undefined {
    return applications?.[0]?.Currency;
  }

  getTotalCollateralItems(score: CrbScore): number {
    return (score.Collateral_Material ?? []).reduce(
      (sum, item) => sum + (item.Items ?? 0),
      0
    );
  }


  statusCode(status: any): string {
    if (!status) return 'unknown';
    const raw = typeof status === 'string' ? status : (status.code ?? status.value ?? '');
    return String(raw).split('.').pop()!.toLowerCase();
  }

  statusLabel(status: any): string {
    if (!status) return 'Unknown';
    return typeof status === 'string' ? status : (status.value ?? status.code ?? 'Unknown');
  }


  formatAmount(amount?: number | null, currency?: string): string {
    if (amount === null || amount === undefined) return 'N/A';
    const value = Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return currency ? `${currency} ${value}` : value;
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


  get latestAttempt(): CreditScoreAttempt | undefined {
    return this.creditScoreAttempts[0];
  }

  get latestScore(): number | null {
    const attempt = this.creditScoreAttempts.find((a) => this.getScore(a));
    return attempt ? (this.getScore(attempt)?.Scoring?.Score ?? null) : null;
  }

  get latestRating(): string | null {
    const attempt = this.creditScoreAttempts.find((a) => this.getScore(a));
    return attempt ? (this.getScore(attempt)?.Scoring?.Rating ?? null) : null;
  }

  get latestBand(): string | null {
    const attempt = this.creditScoreAttempts.find((a) => this.getScore(a));
    return attempt ? (this.getScore(attempt)?.Scoring?.Band ?? null) : null;
  }

  get totalCost(): number {
    return this.creditScoreAttempts.reduce((sum, a) => sum + Number(a.cost ?? 0), 0);
  }


  trackByIndex = (index: number) => index;
  trackByAttemptId = (_: number, a: CreditScoreAttempt) => a.id;
}
