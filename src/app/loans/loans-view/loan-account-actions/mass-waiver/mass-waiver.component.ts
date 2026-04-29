import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Dates } from 'app/core/utils/dates';
import { LoansService } from 'app/loans/loans.service';
import { SettingsService } from 'app/settings/settings.service';
import { Currency } from 'app/shared/models/general.model';

@Component({
  selector: 'mifosx-mass-waiver',
  templateUrl: './mass-waiver.component.html',
  styleUrls: ['./mass-waiver.component.scss']
})
export class MassWaiverComponent implements OnInit {
  @Input() dataObject: any;
  /** Loan Id */
  loanId: string;

  /** Waiver  Form */
  massWaiverForm: UntypedFormGroup;

  /** Currency */
  currency: Currency | null = null;

  isSubmitting = false;

  /**
   * @param {FormBuilder} formBuilder Form Builder.
   * @param {LoansService} loanService Loan Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {SettingsService} settingsService Settings Service
   */

  constructor(
    private formBuilder: UntypedFormBuilder,
    private loanService: LoansService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) {
    this.loanId = this.route.snapshot.params['loanId'];
  }

  ngOnInit() {
    this.createMassWaiverLoanForm();
    if (this.dataObject) {
      this.setMassWaiverDetails();
      if (this.dataObject.currency) {
        this.currency = this.dataObject.currency;
      }
    }
  }

  /**
   * Creates the create close form.
   */
  createMassWaiverLoanForm() {
    this.massWaiverForm = this.formBuilder.group({
      amount: [
        '',
        [
          Validators.required,
          Validators.max(500000)]
      ]
    });
  }

  setMassWaiverDetails() {
    if (!this.dataObject) {
      return;
    }

  }

  /** Submits the repayment form */
  submit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const amount = this.massWaiverForm.value.amount;

    const totalPenalties = this.dataObject?.totalPenaltiesOutstanding || 0;

    // Limit to 500000 STOP
    if (amount > 500000) {
      this.snackBar.open('Maximum allowed per batch is 500,000', 'Close', {
        duration: 3000
      });
      return;
    }

    // Prevent exceeding total penalties
    if (amount > totalPenalties) {
      this.snackBar.open('Amount cannot exceed total penalties', 'Close', {
        duration: 3000
      });
      return;
    }

    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;
    const data = {
      amount,
      dateFormat,
      locale
    };

    const command = 'bulk-waiver';
    data['amount'] = data['amount'] * 1;

    this.loanService.massWaiver(this.loanId, command, data).subscribe((response: any) => {
      this.isSubmitting = false;
      if (!response.resourceId) {
        this.snackBar.open('Mass Waiver submitted for approval', 'Close', {
          duration: 3000
        });
        this.router.navigate(['../../transactions'], { relativeTo: this.route });
        return;
      } else {
        this.router.navigate(['../../transactions'], { relativeTo: this.route });
      }
    });
  }
}
