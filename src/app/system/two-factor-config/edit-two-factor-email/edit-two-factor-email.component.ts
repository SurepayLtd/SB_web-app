/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { SystemService } from '../../system.service';

/**
 * Edit Two-Factor Email Configuration component.
 */
@Component({
  selector: 'mifosx-edit-two-factor-email',
  templateUrl: './edit-two-factor-email.component.html',
  styleUrls: ['./edit-two-factor-email.component.scss']
})
export class EditTwoFactorEmailComponent implements OnInit {
  /** Two-Factor Email Configuration form. */
  emailConfigForm: UntypedFormGroup;
  /** Two-Factor Configuration Data */
  twoFactorConfig: any;

  /**
   * Retrieves the two-factor configuration data from `resolve`.
   * @param {UntypedFormBuilder} formBuilder Form Builder.
   * @param {SystemService} systemService System Service.
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private systemService: SystemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.data.subscribe((data: { twoFactorConfig: any }) => {
      this.twoFactorConfig = data.twoFactorConfig;
    });
  }

  /**
   * Creates the email configuration form.
   */
  ngOnInit() {
    this.createEmailConfigForm();
  }

  /**
   * Creates the email configuration form.
   */
  createEmailConfigForm() {
    this.emailConfigForm = this.formBuilder.group({
      'otp-delivery-email-enable': [this.twoFactorConfig['otp-delivery-email-enable']],
      'otp-delivery-email-subject': [this.twoFactorConfig['otp-delivery-email-subject'], Validators.required],
      'otp-delivery-email-body': [this.twoFactorConfig['otp-delivery-email-body'], Validators.required]
    });
  }

  /**
   * Submits the email configuration form.
   */
  submit() {
    const emailConfig = this.emailConfigForm.value;
    const updatedConfig = { ...this.twoFactorConfig, ...emailConfig };

    this.systemService.updateTwoFactorConfiguration(updatedConfig).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}

