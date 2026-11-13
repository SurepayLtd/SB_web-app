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
 * Edit Two-Factor Email Configuration component.
 */
@Component({
  selector: 'mifosx-edit-two-factor-email',
  templateUrl: './edit-two-factor-email.component.html',
  styleUrls: ['./edit-two-factor-email.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatSlideToggleModule
  ]
})
export class EditTwoFactorEmailComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private systemService = inject(SystemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

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
  constructor() {
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
      'otp-delivery-email-subject': [
        this.twoFactorConfig['otp-delivery-email-subject'],
        Validators.required
      ],
      'otp-delivery-email-body': [
        this.twoFactorConfig['otp-delivery-email-body'],
        Validators.required
      ]
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
