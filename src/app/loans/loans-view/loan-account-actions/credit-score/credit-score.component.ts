import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../../clients/clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../../../../settings/settings.service';
import { LoansService } from '../../../loans.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'mifosx-credit-score',
  templateUrl: './credit-score.component.html',
  styleUrls: ['./credit-score.component.scss']
})
export class CreditScoreComponent implements OnInit {
  loanId: any;

  creditValidationTypes: any[] = [];
  creditScoreTypes: any[] = [];

  isLoading = false;
  isSubmitting = false;

  /** Credit Score form. */
  creditScoreForm: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private formBuilder: UntypedFormBuilder,
    private loansService: LoansService
  ) {
    this.loanId = this.route.parent?.snapshot.paramMap.get('loanId') ?? this.route.snapshot.paramMap.get('loanId');
  }

  ngOnInit(): void {
    this.createScoreForm();
    this.loadTemplate();
  }

  /**
   * Creates the credit score form.
   */
  createScoreForm(): void {
    this.creditScoreForm = this.formBuilder.group({
      crbCreditValidationType: [
        '',
        Validators.required
      ],
      crbCreditScoreType: [
        '',
        Validators.required
      ]
    });
  }

  /**
   * Loads CRB validation and credit score types.
   */
  loadTemplate(): void {
    this.isLoading = true;

    this.clientsService
      .getCrbCheckTemplate()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: any) => {
          const template = Array.isArray(response) ? response[0] : response;

          this.creditValidationTypes = (template?.creditValidationTypes ?? []).filter((type: any) => type.id === 300);

          this.creditScoreTypes = template?.creditScoreTypes ?? [];

          const validationTypeId = this.creditValidationTypes[0]?.id ?? null;

          this.creditScoreForm.patchValue({ crbCreditValidationType: validationTypeId });
        },
        error: () => {
          this.snackBar.open('Failed to load CRB validation types.', 'Close', {
            duration: 4000
          });
        }
      });
  }

  /**
   * Submits the credit score request.
   */
  submitScore(): void {
    if (!this.loanId || !this.creditScoreForm.valid) {
      this.creditScoreForm.markAllAsTouched();

      this.snackBar.open('Please complete all required fields.', 'Close', {
        duration: 3000
      });
      return;
    }

    this.isSubmitting = true;

    const data = {
      ...this.creditScoreForm.value,
      locale: this.settingsService.language.code
    };

    this.loansService
      .createCrbEnquiryOrScore(this.loanId, data)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Credit score request completed.', 'Close', {
            duration: 3000
          });

          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.snackBar.open(
            error?.error?.defaultUserMessage ?? error?.error?.developerMessage ?? 'Credit score request failed.',
            'Close',
            { duration: 5000 }
          );
        }
      });
  }

  cancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
