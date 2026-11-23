import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../../clients/clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../../../../settings/settings.service';
import { LoansService } from '../../../loans.service';
import { finalize } from 'rxjs/operators';
import { SystemService } from '../../../../system/system.service';

@Component({
  selector: 'mifosx-crb-credit-report',
  templateUrl: './crb-credit-report.component.html',
  styleUrls: ['./crb-credit-report.component.scss']
})
export class CrbCreditReportComponent implements OnInit {
  @Output() reportFormatChangeEvent = new EventEmitter<{ format: number }>();

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
    this.loanId = this.route.parent?.snapshot.paramMap.get('loanId') ?? this.route.snapshot.paramMap.get('loanId');
  }

  ngOnInit(): void {
    this.createReportForm();
    this.buildDependencies();
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
      crbReportAction: ['']
    });
  }  /**
   * Adds controls conditionally.
   */
  buildDependencies(): void {
    const reportFormControl = this.creditReportForm.get('crbReportFormat');
    const reportActionControl = this.creditReportForm.get('crbReportAction');

    reportFormControl?.valueChanges.subscribe((format: number) => {
      this.reportFormatChangeEvent.emit({ format });

      if (format === 1) {
        reportActionControl?.clearValidators();
        reportActionControl?.reset(null, { emitEvent: false });
        reportActionControl?.disable({ emitEvent: false });
      } else {
        reportActionControl?.setValidators([Validators.required]);
        reportActionControl?.enable({ emitEvent: false });
      }

      reportActionControl?.updateValueAndValidity({ emitEvent: false });
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
