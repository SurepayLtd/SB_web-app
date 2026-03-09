/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Two-Factor Configuration component.
 * Displays two-factor authentication configuration in tabbed interface.
 * Uses Material tabs, tables, and routing directives.
 */
@Component({
  selector: 'mifosx-two-factor-config',
  templateUrl: './two-factor-config.component.html',
  styleUrls: ['./two-factor-config.component.scss']
})
export class TwoFactorConfigComponent implements OnInit {
  /** Two-Factor Configuration Data */
  twoFactorConfig: any;

  /**
   * Retrieves two-factor configuration data from `resolve`.
   * @param {ActivatedRoute} route Activated Route.
   */
  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe((data: { twoFactorConfig: any }) => {
      this.twoFactorConfig = data.twoFactorConfig;
    });
  }

  ngOnInit(): void {}

  /**
   * Get Email configuration data source
   */
  getEmailDataSource(): any[] {
    if (!this.twoFactorConfig) return [];
    return [
      { name: 'Enable Email Delivery', value: this.twoFactorConfig['otp-delivery-email-enable'] ? 'Enabled' : 'Disabled' },
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
      { name: 'Extended Access Token Live Time (seconds)', value: this.twoFactorConfig['access-token-live-time-extended'] || '' }
    ];
  }
}

