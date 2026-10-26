import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CrbConsentRevokeDialogData {
  narrations: any[];
}

@Component({
  selector: 'mifosx-crb-consent-revoke-dialog',
  templateUrl: './crb-consent-revoke-dialog.component.html',
  styleUrls: ['./crb-consent-revoke-dialog.component.scss']
})
export class CrbConsentRevokeDialogComponent {

  reasonControl = new FormControl<number | null>(
    null,
    Validators.required
  );

  constructor(
    public dialogRef: MatDialogRef<CrbConsentRevokeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CrbConsentRevokeDialogData
  ) {}

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
