import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'app/settings/settings.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mifosx-kyc-enquiry',
  templateUrl: './kyc-enquiry.component.html',
  styleUrls: ['./kyc-enquiry.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class KycEnquiryComponent implements OnInit {

  private formBuilder = inject(UntypedFormBuilder);
  private clientsService = inject(ClientsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private settingsService = inject(SettingsService);
  private snackBar = inject(MatSnackBar);

  clientId: any;

  creditValidationTypes: any[] = [];

  isLoading = false;
  isSubmitting = false;

  /** Kyc Account form. */
  kycEnquiryForm: UntypedFormGroup;

  /** Client Data */
  kycData: any;


  constructor() {
    this.route.data.subscribe((data: { clientActionData: any }) => {
      this.kycData = data.clientActionData.narrations;
    });
    this.clientId = this.route.parent?.snapshot.paramMap.get('clientId') ??
      this.route.snapshot.paramMap.get('clientId');
  }

  ngOnInit(): void {
    this.loadTemplate();
    this.createKycForm();
  }

  /**
   * Creates the reject client form.
   */
  createKycForm() {
    this.kycEnquiryForm = this.formBuilder.group({
      crbCreditValidationType: [
        '',
        Validators.required
      ],
      enquiryReasonId: [
        '',
        Validators.required
      ]
    });
  }

  loadTemplate(): void {
    this.isLoading = true;

    this.clientsService.getCrbCheckTemplate()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          const template = Array.isArray(response)
            ? response[0]
            : response;

          this.creditValidationTypes = (template?.creditValidationTypes ?? [])
            .filter((type: any) => type.id === 100);

          const validationTypeId = this.creditValidationTypes[0]?.id ?? null;

          this.kycEnquiryForm.patchValue({crbCreditValidationType: validationTypeId})
        },
        error: () => {
          this.snackBar.open('Failed to load CRB validation types.', 'Close', { duration: 4000 });
        }
      });
  }

  submitKyc(): void {
    if (!this.clientId || !this.kycEnquiryForm.valid) {
      this.snackBar.open('Select validation type.', 'Close', { duration: 3000 });
      return;
    }
    this.isSubmitting = true;

    const kycFormData = this.kycEnquiryForm.value;
    const locale = this.settingsService.language.code;


    const data = {
      ...kycFormData,
      locale
    }

    this.clientsService.createCrbKycCheck(this.clientId, data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.snackBar.open('Kyc enquiry request completed.', 'Close',
            { duration: 3000 }
          );
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.snackBar.open(error?.error?.defaultUserMessage ?? error?.error?.developerMessage ?? 'KYC enquiry failed.',
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
