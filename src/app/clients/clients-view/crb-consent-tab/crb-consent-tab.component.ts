/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Custom Dialogs */
import { CrbConsentOtpDialogComponent } from '../custom-dialogs/crb-consent-otp-dialog/crb-consent-otp-dialog.component';

/** Custom Services */
import { ClientsService } from '../../clients.service';
import { SettingsService } from 'app/settings/settings.service';
import { formatDate } from '@angular/common';
import {
  CrbConsentRevokeDialogComponent
} from '../custom-dialogs/crb-consent-revoke-dialog/crb-consent-revoke-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'mifosx-crb-consent-tab',
  templateUrl: './crb-consent-tab.component.html',
  styleUrls: ['./crb-consent-tab.component.scss']
})
export class CrbConsentTabComponent implements OnInit {

  /** Component Properties */
  consentData: any;
  consentTemplateData: any;
  isLoading = false;
  isProcessing = false;
  clientId: string;

  /** Consent Channels */
  readonly OTP_CHANNEL = 1;
  readonly PAPER_CHANNEL = 2;

  /** Consent Statuses */
  readonly PENDING = 1;
  readonly VERIFIED = 2;
  readonly REVOKED = 3;
  readonly REACTIVATED = 4;

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private settingsService: SettingsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.route.data.subscribe((data: { consentData: any }) => {
      this.consentData = data.consentData;
      this.clientId = this.route.parent.snapshot.paramMap.get('clientId');
    });
  }

  ngOnInit(): void {
    this.loadConsentTemplate();
  }

  /**
   * Load the revocation reasons and other consent template data.
   */
  loadConsentTemplate(): void {
    this.clientsService.getCrbConsentTemplate('revoke').subscribe({
      next: (response: any) => {
        this.consentTemplateData = response;
      },
      error: () => {
        this.snackBar.open('Failed to retrieve CRB consent template.', 'Close', { duration: 3000 });
      }
    });
  }

  get canValidateOtp(): boolean {
    const status = this.consentData?.consentStatus?.id;

    return this.isOtpConsent && (status === this.PENDING || status === this.REACTIVATED);
  }

  get canResendOtp(): boolean {
    return this.canValidateOtp;
  }

  get canRevokeConsent(): boolean {
    return this.consentData?.consentStatus?.id === this.VERIFIED;
  }

  get canReactivateConsent(): boolean {
    return this.consentData?.consentStatus?.id === this.REVOKED;
  }

  get isOtpConsent(): boolean {
    return this.consentData?.consentChannel?.id === this.OTP_CHANNEL;
  }

  /**
   * Validate the OTP against the selected consent record.
   */
  validateOtp(): void {
    if (!this.canValidateOtp || this.isProcessing) {
      return;
    }

    const dialogRef = this.dialog.open(CrbConsentOtpDialogComponent, {
      width: '400px',
      data: {
        title: 'Validate CRB OTP',
        message: 'Enter the OTP sent to the registered phone number.'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isProcessing = true;

        const data = {
          otpCode: result,
          locale: this.settingsService.language.code
        };

        this.clientsService.updateCrbConsent(this.consentData.id, 'validateOtp', data).subscribe({
          next: () => {
            this.isProcessing = false;
            this.loadConsentData();

            this.snackBar.open('CRB consent verified successfully.', 'Close', { duration: 3000 });
          },
          error: () => {
            this.isProcessing = false;

            this.snackBar.open('Failed to validate CRB consent OTP.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  /**
   * Resend OTP for the selected consent.
   */
  resendOtp(): void {
    if (!this.canResendOtp || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    this.clientsService.updateCrbConsent(this.consentData.id, 'resendOtp', {}).subscribe({
      next: () => {
        this.isProcessing = false;
        this.loadConsentData();

        this.snackBar.open('CRB consent OTP resent successfully.', 'Close', { duration: 3000 });
      },
      error: () => {
        this.isProcessing = false;

        this.snackBar.open('Failed to resend CRB consent OTP.', 'Close', { duration: 3000 });
      }
    });
  }

  /**
   * Refresh the consent record after an action.
   */
  loadConsentData(): void {
    this.isLoading = true;

    this.clientsService.getCrbConsent(this.clientId).subscribe({
      next: (response: any) => {
        this.consentData = response;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;

        this.snackBar.open('Failed to refresh CRB consent.', 'Close', { duration: 3000 });
      }
    });
  }

  revokeConsent(): void {
    if (!this.consentData?.id || this.isProcessing || !this.canRevokeConsent) {
      return;
    }

    this.isProcessing = true;

    this.clientsService.getCrbConsentTemplate('revoke')
      .subscribe({
        next: (template: any) => {
          this.isProcessing = false;
          const narrations = (template?.narrations ?? [])
            .filter((narration: any) => narration.active)
            .sort((a: any, b: any) => a.position - b.position);

          if (narrations.length === 0) {
            this.snackBar.open('No revocation reasons are available.', 'Close', { duration: 5000 });
            return;
          }

          const dialogRef = this.dialog.open(CrbConsentRevokeDialogComponent,
            {
              width: '450px',
              maxWidth: '95vw',
              disableClose: true,
              data: { narrations }
            }
          );

          dialogRef.afterClosed().subscribe((revokeReasonId: number | null) => {
            if (revokeReasonId == null) {
              return;
            }
            this.submitConsentRevocation(revokeReasonId);
          });
        },
        error: (error) => {
          this.isProcessing = false;
          this.snackBar.open(error?.error?.defaultUserMessage || 'Failed to load revocation reasons.', 'Close', { duration: 5000 });
        }
      });
  }

  private submitConsentRevocation(revokeReasonId: number): void {
    if (!this.consentData?.id || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    this.clientsService.updateCrbConsent(this.consentData.id, 'revoke', { revokeReasonId })
      .subscribe({
        next: () => {
          this.isProcessing = false;
          this.snackBar.open('CRB consent revoked successfully.', 'Close', { duration: 5000 });
          this.loadConsentData();
        },
        error: (error) => {
          this.isProcessing = false;
          this.snackBar.open(error?.error?.defaultUserMessage || 'Failed to revoke CRB consent.', 'Close', { duration: 5000 });
        }
      });
  }


  reactivateConsent(): void {
    if (!this.consentData?.id || this.isProcessing || !this.canReactivateConsent) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        heading: 'Reactivate CRB Consent',
        dialogContext: 'Are you sure you want to reactivate this CRB consent?',
        submitLabel: 'Reactivate',
        type: 'confirm'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed || this.isProcessing) {
        return;
      }

      this.isProcessing = true;

      this.clientsService.updateCrbConsent(this.consentData.id, 'reactivate', {})
        .subscribe({
          next: () => {
            this.isProcessing = false;
            this.snackBar.open('CRB consent reactivated successfully.', 'Close', { duration: 5000 });
            this.loadConsentData();
          },
          error: (error) => {
            this.isProcessing = false;
            this.snackBar.open(error?.error?.defaultUserMessage || 'Failed to reactivate CRB consent.', 'Close', { duration: 5000 });
          }
        });
    });
  }

  /**
   * Format a date using the application's configured date format.
   */
  formatConsentDate(date: number[] | undefined): string {
    if (!date || date.length < 3) {
      return '-';
    }

    const value = new Date(date[0], date[1] - 1, date[2], date[3] ?? 0, date[4] ?? 0, date[5] ?? 0);

    return formatDate(value, this.settingsService.dateFormat, this.settingsService.language.code);
  }

  /**
   * Get a readable consent status.
   */
  getConsentStatus(): string {
    switch (this.consentData?.consentStatus?.id) {
      case this.PENDING:
        return 'Pending';
      case this.VERIFIED:
        return 'Verified';
      case this.REVOKED:
        return 'Revoked';
      case this.REACTIVATED:
        return 'Reactivated';

      default:
        return 'Unknown';
    }
  }

}
