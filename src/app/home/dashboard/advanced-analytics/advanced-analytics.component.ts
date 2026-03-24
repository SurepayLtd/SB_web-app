/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

/** Custom Services */
import { HomeService } from '../../home.service';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { SettingsService } from '../../../settings/settings.service';
import { Dates } from '../../../core/utils/dates';

/**
 * Advanced Analytics Dashboard Component.
 * Displays portfolio health, liquidity, business performance, and other KPIs.
 * Supports filtering by date range and office.
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
  /** Filter form group */
  filterForm: UntypedFormGroup;
  /** List of offices for dropdown */
  offices: any[] = [];
  /** Maximum allowed date for datepicker */
  maxDate = new Date();
  /** Minimum allowed date for datepicker */
  minDate = new Date(2000, 0, 1);

  constructor(
    private fb: UntypedFormBuilder,
    private homeService: HomeService,
    private authenticationService: AuthenticationService,
    private settingsService: SettingsService,
    private dateUtils: Dates
  ) {}

  ngOnInit(): void {
    this.maxDate = this.settingsService.businessDate || new Date();
    this.buildFilterForm();
    this.loadOffices();
    this.applyFilters();
  }

  /** Builds the filter form with sensible defaults */
  private buildFilterForm(): void {
    const today = this.settingsService.businessDate || new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const credentials = this.authenticationService.getCredentials();
    const defaultOfficeId = credentials ? credentials.officeId : null;

    this.filterForm = this.fb.group({
      startDate: [
        firstOfMonth,
        Validators.required
      ],
      endDate: [
        today,
        Validators.required
      ],
      officeId: [defaultOfficeId]
    });
  }

  /** Loads offices list from the API */
  loadOffices(): void {
    this.homeService.getOffices().subscribe({
      next: (data: any[]) => {
        this.offices = data;
      },
      error: () => {
        this.offices = [];
      }
    });
  }

  /** Formats a JS Date to the API-required yyyy-MM-dd string */
  private toApiDate(date: Date): string {
    return this.dateUtils.formatDate(date, 'yyyy-MM-dd');
  }

  /** Reads the filter form and fires the API call */
  applyFilters(): void {
    if (this.filterForm && this.filterForm.invalid) {
      return;
    }
    const { startDate, endDate, officeId } = this.filterForm
      ? this.filterForm.value
      : { startDate: new Date(), endDate: new Date(), officeId: null };

    const start = this.toApiDate(startDate);
    const end = this.toApiDate(endDate);
    const office = officeId ? Number(officeId) : 0;

    this.isLoading = true;
    this.hasError = false;
    this.homeService.getDashboardAnalytics(start, end, office).subscribe({
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

  /** Resets the filter form to defaults and re-fetches */
  resetFilters(): void {
    const today = this.settingsService.businessDate || new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const credentials = this.authenticationService.getCredentials();
    this.filterForm.patchValue({
      startDate: firstOfMonth,
      endDate: today,
      officeId: credentials ? credentials.officeId : null
    });
    this.applyFilters();
  }

  /** Format array date [yyyy, m, d] to readable string */
  formatDate(dateArr: number[]): string {
    if (!dateArr || dateArr.length < 3) {
      return '—';
    }
    const d = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  /** Format currency values */
  formatCurrency(value: number): string {
    if (value == null) {
      return '—';
    }
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  }

  /** Format percentage values */
  formatPercent(value: number): string {
    if (value == null) {
      return '—';
    }
    return value.toFixed(2) + '%';
  }
}
