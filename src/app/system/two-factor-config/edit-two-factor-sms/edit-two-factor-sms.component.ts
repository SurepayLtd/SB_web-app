/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { SystemService } from '../../system.service';

/**
 * Edit Two-Factor SMS Configuration component.
 */
@Component({
  selector: 'mifosx-edit-two-factor-sms',
  templateUrl: './edit-two-factor-sms.component.html',
  styleUrls: ['./edit-two-factor-sms.component.scss']
})
export class EditTwoFactorSmsComponent implements OnInit {
  /** Two-Factor SMS Configuration form. */
  smsConfigForm: UntypedFormGroup;
  /** Two-Factor Configuration Data */
  twoFactorConfig: any;

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

  ngOnInit() {
    this.createSmsConfigForm();
  }

  createSmsConfigForm() {
    this.smsConfigForm = this.formBuilder.group({
      'otp-delivery-sms-enable': [this.twoFactorConfig['otp-delivery-sms-enable']],
      'otp-delivery-sms-provider': [this.twoFactorConfig['otp-delivery-sms-provider'], Validators.required],
      'otp-delivery-sms-text': [this.twoFactorConfig['otp-delivery-sms-text'], Validators.required]
    });
  }

  submit() {
    const smsConfig = this.smsConfigForm.value;
    const updatedConfig = { ...this.twoFactorConfig, ...smsConfig };

    this.systemService.updateTwoFactorConfiguration(updatedConfig).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}

