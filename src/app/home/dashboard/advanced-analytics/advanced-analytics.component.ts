/** Angular Imports */
import { Component, OnInit } from '@angular/core';

/** Custom Services */
import { HomeService } from '../../home.service';

/**
 * Advanced Analytics Dashboard Component.
 * Displays portfolio health, liquidity, business performance, and other KPIs.
 */
@Component({
  selector: 'mifosx-advanced-analytics',
  templateUrl: './advanced-analytics.component.html',
  styleUrls: ['./advanced-analytics.component.scss']
})
export class AdvancedAnalyticsComponent implements OnInit {
  /** Analytics data from API */
  analyticsData: any = null;
  /** Loading state */
  isLoading = true;
  /** Error state */
  hasError = false;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.isLoading = true;
    this.hasError = false;
    this.homeService.getDashboardAnalytics().subscribe({
      next: (data: any) => {
        this.analyticsData = data;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  /** Format array date [yyyy, m, d] to readable string */
  formatDate(dateArr: number[]): string {
    if (!dateArr || dateArr.length < 3) { return '—'; }
    const d = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  /** Format currency values */
  formatCurrency(value: number): string {
    if (value == null) { return '—'; }
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  /** Format percentage values */
  formatPercent(value: number): string {
    if (value == null) { return '—'; }
    return value.toFixed(2) + '%';
  }
}

