import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'mifosx-crb-consent-otp-dialog',
  templateUrl: './crb-consent-otp-dialog.component.html',
  styleUrls: ['./crb-consent-otp-dialog.component.scss']
})
export class CrbConsentOtpDialogComponent implements OnInit {

  otpForm: UntypedFormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrbConsentOtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit() {
    this.createOtpForm();
  }

  createOtpForm(){
    this.otpForm  = this.formBuilder.group({
      otp: ['', Validators.required]
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
