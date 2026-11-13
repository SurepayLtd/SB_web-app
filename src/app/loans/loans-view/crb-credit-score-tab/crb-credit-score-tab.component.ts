import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrbScore, CreditApplicationSummary, CreditEnquiryCheck, CreditScoreAttempt, MnoScore } from '../../models/loan-account.model';

@Component({
  selector: 'mifosx-crb-credit-score-tab',
  templateUrl: './crb-credit-score-tab.component.html',
  styleUrls: ['./crb-credit-score-tab.component.scss']
})
export class CrbCreditScoreTabComponent implements OnInit {

  creditScoreAttempts: CreditScoreAttempt[] = [];

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { creditScoreData: CreditScoreAttempt[] }) => {
      this.creditScoreAttempts = this.parseCreditScoreChecks(data.creditScoreData || []);
    });
  }

  ngOnInit(): void {
  }

  private parseCreditScoreChecks(creditScoreData: CreditScoreAttempt[]): CreditScoreAttempt[] {
    return creditScoreData.map((check: CreditScoreAttempt) => this.parseCreditScoreCheck(check));
  }

  private parseCreditScoreCheck(check: CreditScoreAttempt): CreditScoreAttempt {
    try {
      return {
        ...check, parsedResponse: check.responsePayload ? JSON.parse(check.responsePayload) : null,
        parseError: false
      };
    } catch (error) {
      return {
        ...check, parsedResponse: null, parseError: true
      };
    }
  }

  getScore(attempt: CreditScoreAttempt): CrbScore | null {
    return attempt.parsedResponse?.data?.CRB || null;
  }

  getMnoScore(attempt: CreditScoreAttempt): MnoScore | null {
    return attempt.parsedResponse?.data?.MNO || null;
  }

  getHistory(score: CrbScore): { period: string; value: number }[] {
    const history = score.Scoring?.History_Max_12Months;

    if (!history) {
      return [];
    }

    return Object.keys(history)
      .sort((a, b) => b.localeCompare(a))
      .map((period) => ({
        period,
        value: history[period]
      }));
  }

  getCreatedAt(value: number[] | undefined): string {
    return this.formatDateArray(value);
  }

  getCompletedAt(value: number[] | undefined): string {
    return this.formatDateArray(value);
  }

  private formatDateArray(value: number[] | undefined): string {
    if (!value || value.length < 3) {
      return 'N/A';
    }

    const [year, month, day, hour = 0, minute = 0, second = 0] = value;

    const date = new Date(year, month - 1, day, hour, minute, second);

    return date.toLocaleString();
  }

  formatAmount(amount: number | undefined, currency?: string): string {
    if (amount === null || amount === undefined) {
      return 'N/A';
    }

    return `${currency ? currency + ' ' : ''}${amount.toLocaleString()}`;
  }

  getApplicationTotal(applications: CreditApplicationSummary[] | undefined): number {
    if (!applications?.length) {
      return 0;
    }

    return applications.reduce(
      (total, application) => total + (application.Count || 0),
      0
    );
  }

  getApplicationValue(applications: CreditApplicationSummary[] | undefined): number {
    if (!applications?.length) {
      return 0;
    }

    return applications.reduce(
      (total, application) => total + (application.Value || 0),
      0
    );
  }

  getTotalCollateralItems(score: CrbScore): number {
    return (score.Collateral_Material || []).reduce(
      (total, item) => total + (item.Items || 0),
      0
    );
  }

  hasProviderError(attempt: CreditScoreAttempt): boolean {
    return !!(
      attempt.parsedResponse?.data?.CRB?.Errors ||
      attempt.parsedResponse?.data?.MNO?.Errors
    );
  }

}
