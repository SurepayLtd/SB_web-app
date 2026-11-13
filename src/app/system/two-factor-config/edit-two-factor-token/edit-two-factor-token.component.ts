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

/**
 * Edit Two-Factor Token Configuration component.
 */
@Component({
  selector: 'mifosx-edit-two-factor-token',
  templateUrl: './edit-two-factor-token.component.html',
  styleUrls: ['./edit-two-factor-token.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule
  ]
})
export class EditTwoFactorTokenComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private systemService = inject(SystemService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** Two-Factor Token Configuration form. */
  tokenConfigForm: UntypedFormGroup;
  /** Two-Factor Configuration Data */
  twoFactorConfig: any;

  constructor() {
    this.route.data.subscribe((data: { twoFactorConfig: any }) => {
      this.twoFactorConfig = data.twoFactorConfig;
    });
  }

  ngOnInit() {
    this.createTokenConfigForm();
  }

  createTokenConfigForm() {
    this.tokenConfigForm = this.formBuilder.group({
      'otp-token-length': [
        this.twoFactorConfig['otp-token-length'],
        [
          Validators.required,
          Validators.min(4),
          Validators.max(10)
        ]
      ],
      'otp-token-live-time': [
        this.twoFactorConfig['otp-token-live-time'],
        [
          Validators.required,
          Validators.min(60)
        ]
      ],
      'access-token-live-time': [
        this.twoFactorConfig['access-token-live-time'],
        [
          Validators.required,
          Validators.min(300)
        ]
      ],
      'access-token-live-time-extended': [
        this.twoFactorConfig['access-token-live-time-extended'],
        [
          Validators.required,
          Validators.min(300)
        ]
      ]
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
