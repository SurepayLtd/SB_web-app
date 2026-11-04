import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ClientsService } from '../../clients.service';

type ValidationGroup = 'details' | 'nin' | 'phone';

@Component({
  selector: 'mifosx-crb-checks-tab',
  templateUrl: './crb-checks-tab.component.html',
  styleUrls: ['./crb-checks-tab.component.scss']
})
export class CrbChecksTabComponent implements OnInit {

  clientId: string;
  checks: any[] = [];

  loading = false;
  loaded = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientsService,
    private snackBar: MatSnackBar
  ) {
    this.route.data.subscribe((data: { checks: any }) => {
      this.checks = data.checks;
      this.clientId = this.route.parent.snapshot.paramMap.get('clientId');
    });
  }

  ngOnInit(): void {
    this.refreshHistory();
  }

  refreshHistory(): void {
    if (!this.clientId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.clientService.getCrbCheckHistory(this.clientId).subscribe({
      next: (response: any ) => {
        const records = Array.isArray(response)
          ? response
          : response?.pageItems ?? [];

        this.checks = [...records].sort(
          (a, b) => this.toTimestamp(b.createdAt) -
            this.toTimestamp(a.createdAt)
        );

        this.loading = false;
        this.loaded = true;
      },
      error: () => {
        this.loading = false;
        this.loaded = true;
        this.errorMessage = 'Unable to load CRB verification history.';
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  get detailsChecks() {
    return this.filterByType('details');
  }

  get ninChecks() {
    return this.filterByType('nin');
  }

  get phoneChecks() {
    return this.filterByType('phone');
  }

  get latestChecks() {
    const groups: ValidationGroup[] = ['details', 'nin', 'phone'];

    return groups
      .map((group) => this.filterByType(group)[0])
      .filter((check) => !!check);
  }

  get latestConsentStatus(): string {
    return this.checks.find((check) => check.consentStatus?.value)
      ?.consentStatus?.value ?? 'Not available';
  }

  get totalCost(): number {
    return this.checks.reduce(
      (total, check) => total + Number(check.cost ?? 0),
      0
    );
  }

  get verifiedCount(): number {
    return this.checks.filter(
      (check) => check.status?.value?.toLowerCase() === 'verified'
    ).length;
  }

  filterByType(type: ValidationGroup): any[] {
    return this.checks.filter((check) => {
      const value = check.validationType?.value?.toLowerCase() ?? '';
      const code = check.validationType?.code?.toLowerCase() ?? '';

      switch (type) {
        case 'details':
          return value.includes('customer details') ||
            value.includes('personal details');

        case 'nin':
          return value.includes('nin') || code.endsWith('.nin');

        case 'phone':
          return value.includes('phone') || code.endsWith('.phone');

        default:
          return false;
      }
    });
  }

  parseResponsePayload(check: any): unknown {
    if (!check.responsePayload) {
      return null;
    }

    try {
      return JSON.parse(check.responsePayload);
    } catch {
      return check.responsePayload;
    }
  }

  formatDate(value?: number[] | string): string {
    if (!value) {
      return '—';
    }

    let date: Date;

    if (Array.isArray(value)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = value;
      date = new Date(year, month - 1, day, hour, minute, second);
    } else {
      date = new Date(value);
    }

    return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
  }

  formatCost(check: any): string {
    if (check.cost == null) {
      return '—';
    }

    return `${check.currency ?? ''} ${Number(check.cost).toLocaleString(
      undefined,
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}`.trim();
  }

  statusClass(status?: string): string {
    switch (status?.toLowerCase()) {
      case 'verified':
        return 'status-success';
      case 'failed':
      case 'rejected':
      case 'error':
        return 'status-failed';
      case 'pending':
      case 'processing':
        return 'status-pending';
      default:
        return 'status-neutral';
    }
  }

  trackByCheckId(_index: number, check: any): number {
    return check.id;
  }

  private toTimestamp(value?: number[] | string): number {
    if (!value) {
      return 0;
    }

    if (Array.isArray(value)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = value;
      return new Date(year, month - 1, day, hour, minute, second).getTime();
    }

    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

}
