/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

export interface CrbConsentRevokeDialogData {
  narrations: any[];
}

@Component({
  selector: 'mifosx-crb-consent-revoke-dialog',
  templateUrl: './crb-consent-revoke-dialog.component.html',
  styleUrls: ['./crb-consent-revoke-dialog.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatDialogModule
  ]
})
export class CrbConsentRevokeDialogComponent {
  dialogRef = inject<MatDialogRef<CrbConsentRevokeDialogComponent>>(MatDialogRef);
  data = inject<CrbConsentRevokeDialogData>(MAT_DIALOG_DATA);

  reasonControl = new FormControl<number | null>(null, Validators.required);

  cancel(): void {
    this.dialogRef.close();
  }

  confirmRevocation(): void {
    if (this.reasonControl.invalid) {
      this.reasonControl.markAsTouched();
      return;
    }

    this.dialogRef.close(this.reasonControl.value);
  }
}
