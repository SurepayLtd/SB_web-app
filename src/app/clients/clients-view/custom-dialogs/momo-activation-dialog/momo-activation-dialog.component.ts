import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'mifosx-momo-activation-dialog',
  templateUrl: './momo-activation-dialog.component.html',
  styleUrls: []
})
export class MomoActivationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MomoActivationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
