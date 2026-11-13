/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTableModule } from '@angular/material/table';

/**
 * Two-Factor Configuration component.
 * Displays two-factor authentication configuration in tabbed interface.
 * Uses Material tabs, tables, and routing directives.
 */
@Component({
  selector: 'mifosx-two-factor-config',
  templateUrl: './two-factor-config.component.html',
  styleUrls: ['./two-factor-config.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatTabsModule,
    FontAwesomeModule,
    MatTableModule
  ]
})
export class TwoFactorConfigComponent {
  private route = inject(ActivatedRoute);

  /** Two-Factor Configuration Data */
  twoFactorConfig: any;

  /**
   * Retrieves two-factor configuration data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor() {
    this.route.data.subscribe((data: { twoFactorConfig: any }) => {
      this.twoFactorConfig = data.twoFactorConfig;
    });
  }

  /**
   * Get Email configuration data source
   */
  getEmailDataSource(): any[] {
    if (!this.twoFactorConfig) return [];
    return [
      {
        name: 'Enable Email Delivery',
        value: this.twoFactorConfig['otp-delivery-email-enable'] ? 'Enabled' : 'Disabled'
      },
      { name: 'Email Subject', value: this.twoFactorConfig['otp-delivery-email-subject'] || '' },
      { name: 'Email Body', value: this.twoFactorConfig['otp-delivery-email-body'] || '' }
    ];
  }

  /**
   * Get SMS configuration data source
   */
  getSmsDataSource(): any[] {
    if (!this.twoFactorConfig) return [];
    return [
      { name: 'Enable SMS Delivery', value: this.twoFactorConfig['otp-delivery-sms-enable'] ? 'Enabled' : 'Disabled' },
      { name: 'SMS Provider', value: this.twoFactorConfig['otp-delivery-sms-provider'] || '' },
      { name: 'SMS Text', value: this.twoFactorConfig['otp-delivery-sms-text'] || '' }
    ];
  }

  /**
   * Get Token configuration data source
   */
  getTokenDataSource(): any[] {
    if (!this.twoFactorConfig) return [];
    return [
      { name: 'OTP Token Length', value: this.twoFactorConfig['otp-token-length'] || '' },
      { name: 'OTP Token Live Time (seconds)', value: this.twoFactorConfig['otp-token-live-time'] || '' },
      { name: 'Access Token Live Time (seconds)', value: this.twoFactorConfig['access-token-live-time'] || '' },
      {
        name: 'Extended Access Token Live Time (seconds)',
        value: this.twoFactorConfig['access-token-live-time-extended'] || ''
      }
    ];
  }
}
