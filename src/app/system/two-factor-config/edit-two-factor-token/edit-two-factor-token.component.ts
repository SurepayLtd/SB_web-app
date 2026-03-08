/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { SystemService } from '../../system.service';

/**
 * Edit Two-Factor Token Configuration component.
 */
@Component({
  selector: 'mifosx-edit-two-factor-token',
  templateUrl: './edit-two-factor-token.component.html',
  styleUrls: ['./edit-two-factor-token.component.scss']
})
export class EditTwoFactorTokenComponent implements OnInit {
  /** Two-Factor Token Configuration form. */
  tokenConfigForm: UntypedFormGroup;
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
    this.createTokenConfigForm();
  }

  createTokenConfigForm() {
    this.tokenConfigForm = this.formBuilder.group({
      'otp-token-length': [this.twoFactorConfig['otp-token-length'], [Validators.required, Validators.min(4), Validators.max(10)]],
      'otp-token-live-time': [this.twoFactorConfig['otp-token-live-time'], [Validators.required, Validators.min(60)]],
      'access-token-live-time': [this.twoFactorConfig['access-token-live-time'], [Validators.required, Validators.min(300)]],
      'access-token-live-time-extended': [this.twoFactorConfig['access-token-live-time-extended'], [Validators.required, Validators.min(300)]]
    });
  }

  submit() {
    const tokenConfig = this.tokenConfigForm.value;
    const updatedConfig = { ...this.twoFactorConfig, ...tokenConfig };

    this.systemService.updateTwoFactorConfiguration(updatedConfig).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}

