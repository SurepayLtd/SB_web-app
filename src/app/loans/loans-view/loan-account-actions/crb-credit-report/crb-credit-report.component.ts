import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoansService } from '../../../loans.service';
import { finalize } from 'rxjs/operators';
import { ClientsService } from 'app/clients/clients.service';
import { SettingsService } from 'app/settings/settings.service';
import { SystemService } from 'app/system/system.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mifosx-crb-credit-report',
  templateUrl: './crb-credit-report.component.html',
  styleUrls: ['./crb-credit-report.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
  ]
})
export class CrbCreditReportComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router =  inject(Router);
  private clientsService = inject(ClientsService);
  private snackBar = inject(MatSnackBar);
  private settingsService= inject(SettingsService);
  private formBuilder = inject(UntypedFormBuilder);
  private loansService = inject(LoansService);
  private systemService = inject(SystemService);


  loanId: any;

  creditBureaus: any[] = [];
  creditReportTypes: any[] = [];
  creditReportFormatTypes: any[] = [];
  creditReportActionTypes: any[] = [];

  isLoadingBureau = false;
  isLoadingTemplate = false;
  isSubmitting = false;

  /** Credit Report form. */
  creditReportForm: UntypedFormGroup;

  constructor() {
    this.loanId = this.route.parent?.snapshot.paramMap.get('loanId') ?? this.route.snapshot.paramMap.get('loanId');
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
    this.creditReportForm = this.formBuilder.group({
      creditBureauID: [
        '',
        Validators.required
      ],
      loanId: [
        this.loanId,
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
      crbReportAction: [
        '',
        Validators.required
      ]
    });
  }

  /**
   * Loads available credit bureaus.
   * Only Gnugrid is supported for this report request.
   */
  loadCreditBureau(): void {
    this.isLoadingBureau = true;

    this.systemService
      .getCreditBureauProviders()
      .pipe(finalize(() => (this.isLoadingBureau = false)))
      .subscribe({
        next: (response: any[]) => {
          this.creditBureaus = (response || []).filter(
            (bureau: any) => (bureau.implementationKey || '').toUpperCase() === 'GNUGRID'
          );

          if (this.creditBureaus.length) {
            this.creditReportForm.patchValue({
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

          // Only Credit Report (500), excluding KYC Report (600).
          this.creditReportTypes = (template?.creditReportTypes || []).filter((type: any) => type.id === 500);

          this.creditReportFormatTypes = template?.creditReportFormatTypes || [];
          this.creditReportActionTypes = template?.creditReportActionTypes || [];

          this.creditReportForm.patchValue({
            crbReportType: this.creditReportTypes[0]?.id ?? null,
            crbReportFormat: this.creditReportFormatTypes[0]?.id ?? null,
            crbReportAction: this.creditReportActionTypes[0]?.id ?? null
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
    if (!this.loanId || !this.creditReportForm.valid) {
      this.creditReportForm.markAllAsTouched();

      this.snackBar.open('Please complete all required fields.', 'Close', { duration: 3000 });
      return;
    }

    this.isSubmitting = true;

    const data = {
      ...this.creditReportForm.value,
      loanId: this.loanId,
      locale: this.settingsService.language.code
    };

    this.loansService
      .createCrbReport(data)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Credit report request completed.', 'Close', { duration: 3000 });

          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.snackBar.open(
            error?.error?.defaultUserMessage ?? error?.error?.developerMessage ?? 'Credit report request failed.',
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
