/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

/** Custom Services */
import { SystemService } from '../../system.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

/**
 * Edit Two-Factor SMS Configuration component.
 */
@Component({
  selector: 'mifosx-edit-two-factor-sms',
  templateUrl: './edit-two-factor-sms.component.html',
  styleUrls: ['./edit-two-factor-sms.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatSlideToggleModule
  ]
})
export class EditTwoFactorSmsComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private systemService = inject(SystemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** Two-Factor SMS Configuration form. */
  smsConfigForm: UntypedFormGroup;
  /** Two-Factor Configuration Data */
  twoFactorConfig: any;

  constructor() {
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
      'otp-delivery-sms-provider': [
        this.twoFactorConfig['otp-delivery-sms-provider'],
        Validators.required
      ],
      'otp-delivery-sms-text': [
        this.twoFactorConfig['otp-delivery-sms-text'],
        Validators.required
      ]
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
