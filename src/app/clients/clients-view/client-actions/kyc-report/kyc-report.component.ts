import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../../../../settings/settings.service';
import { LoansService } from '../../../../loans/loans.service';
import { SystemService } from '../../../../system/system.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'mifosx-kyc-report',
  templateUrl: './kyc-report.component.html',
  styleUrls: ['./kyc-report.component.scss']
})
export class KycReportComponent implements OnInit {

  clientId: any;

  creditBureaus: any[] = [];
  creditReportTypes: any[] = [];
  creditReportFormatTypes: any[] = [];

  isLoadingBureau = false;
  isLoadingTemplate = false;
  isSubmitting = false;

  /** KYC Report form. */
  kycReportForm: UntypedFormGroup;

  /** Client Data */
  kycData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private formBuilder: UntypedFormBuilder,
    private loansService: LoansService,
    private systemService: SystemService
  ) {
    {
      this.route.data.subscribe((data: { clientActionData: any }) => {
        this.kycData = data.clientActionData.narrations;
      });
      this.clientId = this.route.parent?.snapshot.paramMap.get('clientId') ??
        this.route.snapshot.paramMap.get('clientId');
    }
  }

  ngOnInit(): void {
    this.createReportForm();
    this.loadCreditBureau();
    this.loadTemplate();
  }

  /**
   * Creates the credit report form.
   */
  createReportForm(): void {
    this.kycReportForm = this.formBuilder.group({
      creditBureauID: [
        '',
        Validators.required
      ],
      clientId: [
        this.clientId,
        Validators.required
      ],
      crbReportType: [
        '',
        Validators.required
      ],
      crbReportFormat: [
        '',
        Validators.required
      ],
    });
  }

  /**
   * Loads available credit bureaus.
   * Only Gnugrid is supported for this report request.
   */
  loadCreditBureau(): void {
    this.isLoadingBureau = true;

    this.systemService.getCreditBureauProviders()
      .pipe(finalize(() => (this.isLoadingBureau = false)))
      .subscribe({
        next: (response: any[]) => {
          this.creditBureaus = (response || []).filter(
            (bureau: any) => (bureau.implementationKey || '').toUpperCase() === 'GNUGRID'
          );

          if (this.creditBureaus.length) {
            this.kycReportForm.patchValue({
              creditBureauID: this.creditBureaus[0].creditBureauId
            });
          } else {
            this.snackBar.open('Gnugrid credit bureau is not configured.', 'Close', { duration: 4000 });
          }
        },
        error: () => {
          this.snackBar.open('Failed to load credit bureau providers.', 'Close', { duration: 4000 });
        }
      });
  }

  /**
   * Loads credit report types, formats and actions.
   */
  loadTemplate(): void {
    this.isLoadingTemplate = true;

    this.clientsService
      .getCrbCheckTemplate()
      .pipe(finalize(() => (this.isLoadingTemplate = false)))
      .subscribe({
        next: (response: any) => {
          const template = Array.isArray(response) ? response[0] : response;

          // Only KYC Report (600), excluding Credit Report (500).
          this.creditReportTypes = (template?.creditReportTypes || []).filter((type: any) => type.id === 600);

          this.creditReportFormatTypes = (template?.creditReportFormatTypes || []).filter((type: any) => type.id === 1);

          this.kycReportForm.patchValue({
            crbReportType: this.creditReportTypes[0]?.id ?? null,
            crbReportFormat: this.creditReportFormatTypes[0]?.id ?? null,
          });
        },
        error: () => {
          this.snackBar.open('Failed to load credit report options.', 'Close', { duration: 4000 });
        }
      });
  }

  /**
   * Submits the credit report request.
   */
  submitReport(): void {
    if (!this.clientId || !this.kycReportForm.valid) {
      this.kycReportForm.markAllAsTouched();

      this.snackBar.open('Please complete all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    const data = {
      ...this.kycReportForm.value,
      clientId: this.clientId,
      locale: this.settingsService.language.code
    };

    this.loansService.createCrbReport(data)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('KYC report request completed.', 'Close', { duration: 3000 });

          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.snackBar.open(
            error?.error?.defaultUserMessage ?? error?.error?.developerMessage ?? 'Kyc report request failed.',
            'Close',
            { duration: 5000 }
          );
        }
      });
  }

  cancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  get isLoading(): boolean {
    return this.isLoadingBureau || this.isLoadingTemplate;
  }
}
