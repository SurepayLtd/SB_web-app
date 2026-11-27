/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'mifosx-crb-consent-otp-dialog',
  templateUrl: './crb-consent-otp-dialog.component.html',
  styleUrls: ['./crb-consent-otp-dialog.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatDialogModule
  ]
})
export class CrbConsentOtpDialogComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<CrbConsentOtpDialogComponent>>(MatDialogRef);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  otpForm: UntypedFormGroup;

  ngOnInit() {
    this.createOtpForm();
  }

  createOtpForm() {
    this.otpForm = this.formBuilder.group({
      otp: [
        '',
        Validators.required
      ]
    });
  }

  submit(): void {
    if (this.otpForm.valid) {
      this.dialogRef.close(this.otpForm.value.otp);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
