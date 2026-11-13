import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../../clients/clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from '../../../../settings/settings.service';
import { finalize } from 'rxjs/operators';
import { LoansService } from '../../../loans.service';

@Component({
  selector: 'mifosx-credit-enquiry',
  templateUrl: './credit-enquiry.component.html',
  styleUrls: ['./credit-enquiry.component.scss']
})
export class CreditEnquiryComponent implements OnInit {

  loanId: any;

  creditValidationTypes: any[] = [];

  isLoading = false;
  isSubmitting = false;

  /** Kyc Account form. */
  creditEnquiryForm: UntypedFormGroup;

  /** Client Data */
  creditData: any;

  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {ClientsService} clientsService Clients Service
   * @param snackBar
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SettingsService} settingsService Setting service
   * @param loansService
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    private formBuilder: UntypedFormBuilder,
    private loansService: LoansService
  ) {
    this.route.data.subscribe((data: { actionButtonData: any }) => {
      this.creditData = data.actionButtonData.narrations;
    });
    this.loanId = this.route.parent?.snapshot.paramMap.get('loanId') ??
      this.route.snapshot.paramMap.get('loanId');
  }

  ngOnInit(): void {
    this.loadTemplate();
    this.createEnquiryForm();
  }

  /**
   * Creates the reject client form.
   */
  createEnquiryForm(): void {
    this.creditEnquiryForm = this.formBuilder.group({
      crbCreditValidationType: ['', Validators.required],
      enquiryReasonId: ['', Validators.required]
    });
  }

  loadTemplate(): void {
    this.isLoading = true;

    this.clientsService.getCrbCheckTemplate()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          const template = Array.isArray(response)
            ? response[0] : response;

          this.creditValidationTypes = (template?.creditValidationTypes ?? [])
            .filter((type: any) => type.id === 200);

          const validationTypeId = this.creditValidationTypes[0]?.id ?? null;

          this.creditEnquiryForm.patchValue({ crbCreditValidationType: validationTypeId });
        },
        error: () => {
          this.snackBar.open('Failed to load CRB validation types.', 'Close', {
            duration: 4000
          });
        }
      });
  }



  submitEnquiry(): void {
    if (!this.loanId || !this.creditEnquiryForm.valid) {
      this.creditEnquiryForm.markAllAsTouched();

      this.snackBar.open('Please complete all required fields.', 'Close', {
        duration: 3000
      });
      return;
    }

    this.isSubmitting = true;

    const data = {
      ...this.creditEnquiryForm.value,
      locale: this.settingsService.language.code
    };

    this.loansService.createCrbEnquiryOrScore(this.loanId, data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Credit enquiry request completed.', 'Close', {
            duration: 3000
          });

          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.snackBar.open(error?.error?.defaultUserMessage ?? error?.error?.developerMessage ??
            'Credit enquiry failed.',
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
