/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../clients.service';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingsService } from 'app/settings/settings.service';

/** Value of the Paper channel in the CRB consent template. */
const PAPER_CHANNEL_ID = 2;

@Component({
  selector: 'mifosx-crb-consent',
  templateUrl: './crb-consent.component.html',
  styleUrls: ['./crb-consent.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class CrbConsentComponent implements OnInit {
  private formBuilder = inject(UntypedFormBuilder);
  private clientsService = inject(ClientsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private settingsService = inject(SettingsService);
  private snackBar = inject(MatSnackBar);

  /** CRB consent form. */
  crbConsentForm: UntypedFormGroup;

  /** Client account ID. */
  clientId: any;

  /** Available consent channels. */
  consentChannels: any[] = [];

  /** Indicates whether the channel template is loading. */
  isLoading = false;

  /** Indicates whether the consent request is being submitted. */
  isSubmitting = false;

  /** Selected file for Paper channel */
  selectedFile: File | null = null;
  /** File preview URL (image only) */
  filePreviewUrl: string | null = null;
  /** Client-side file error (size/type) */
  fileError: string | null = null;

  /** Accepted MIME types */
  private readonly ACCEPTED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png'
  ];
  /** 5 MB */
  private readonly MAX_SIZE = 5 * 1024 * 1024;

  readonly consentTemplateName = 'CRB_CONSENT';
  readonly paperChannelId = PAPER_CHANNEL_ID;

  constructor() {
    this.clientId = this.route.parent.snapshot.params['clientId'];
  }

  ngOnInit(): void {
    this.createCrbConsentForm();
    this.loadConsentTemplate();
    this.loadConsentTemplateText();

    // React to channel changes — Paper needs a file, OTP doesn't
    this.crbConsentForm.controls.consentChannel.valueChanges.subscribe(() => {
      if (this.isPaperChannel) {
        this.crbConsentForm.controls.file.setValidators([Validators.required]);
      } else {
        this.crbConsentForm.controls.file.clearValidators();
        this.clearFile();
      }
      this.crbConsentForm.controls.file.updateValueAndValidity();
    });
  }

  get isPaperChannel(): boolean {
    return Number(this.crbConsentForm?.controls.consentChannel.value) === this.paperChannelId;
  }

  createCrbConsentForm(): void {
    this.crbConsentForm = this.formBuilder.group({
      consentChannel: [
        '',
        Validators.required
      ],
      consentText: [
        '',
        Validators.required
      ],
      file: [null]
    });
  }

  /**
   * Loads consent channels from the CRB consent template API.
   */
  loadConsentTemplate(): void {
    this.isLoading = true;
    this.clientsService.getCrbConsentTemplate().subscribe({
      next: (response: any) => {
        this.consentChannels = response.consentChannels || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load consent channels.', 'Close', { duration: 5000 });
      }
    });
  }
  /**
    * Loads the CRB consent text from the templates API.
  */
  loadConsentTemplateText(): void {
    this.isLoading = true;
    this.clientsService.getCrbConsentTemplateName().subscribe({
      next: (templates: any[]) => {
        const consentTemplate = templates.find((t) => t.name === this.consentTemplateName);
        if (consentTemplate) {
          this.crbConsentForm.patchValue({ consentText: consentTemplate.text });
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Failed to load CRB consent template:', error);
      }
    });
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.fileError = null;
    this.clearFilePreview();

    if (!file) {
      this.selectedFile = null;
      this.crbConsentForm.controls.file.setValue(null);
      return;
    }

    if (!this.ACCEPTED_TYPES.includes(file.type)) {
      this.fileError = 'Only PDF, JPG, or PNG files are allowed.';
      this.resetFileInput(input);
      return;
    }

    if (file.size > this.MAX_SIZE) {
      this.fileError = 'File is too large. Maximum size is 10 MB.';
      this.resetFileInput(input);
      return;
    }

    this.selectedFile = file;
    this.crbConsentForm.controls.file.setValue(file);
    this.crbConsentForm.controls.file.markAsTouched();

    if (file.type.startsWith('image/')) {
      this.filePreviewUrl = URL.createObjectURL(file);
    }
  }

  removeFile(input?: HTMLInputElement): void {
    this.selectedFile = null;
    this.fileError = null;
    this.clearFilePreview();
    this.crbConsentForm.controls.file.setValue(null);
    if (input) input.value = '';
  }

  private clearFile(): void {
    this.selectedFile = null;
    this.fileError = null;
    this.clearFilePreview();
    this.crbConsentForm.controls.file.setValue(null);
  }

  private clearFilePreview(): void {
    if (this.filePreviewUrl) {
      URL.revokeObjectURL(this.filePreviewUrl);
      this.filePreviewUrl = null;
    }
  }

  private resetFileInput(input: HTMLInputElement): void {
    input.value = '';
    this.selectedFile = null;
    this.crbConsentForm.controls.file.setValue(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }


  submit(): void {
    if (this.isSubmitting) return;

    if (this.crbConsentForm.invalid) {
      this.crbConsentForm.markAllAsTouched();
      return;
    }

    // Paper channel must have a file
    if (this.isPaperChannel && !this.selectedFile) {
      this.fileError = 'A signed consent document is required for Paper consent.';
      return;
    }

    const formValue = this.crbConsentForm.value;

    const payload = {
      consentChannel: Number(formValue.consentChannel),
      consentText: formValue.consentText,
      locale: this.settingsService.language.code,
      dateFormat: this.settingsService.dateFormat
    };

    this.isSubmitting = true;

    this.clientsService
      .createCrbConsent(this.clientId, payload, this.isPaperChannel ? this.selectedFile : null)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.clearFilePreview();
          this.snackBar.open('CRB consent recorded successfully.', 'Close', { duration: 3000 });
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.isSubmitting = false;
          this.snackBar.open(error?.error?.defaultUserMessage || 'Failed to create CRB consent.', 'Close', {
            duration: 5000
          });
        }
      });
  }

}
