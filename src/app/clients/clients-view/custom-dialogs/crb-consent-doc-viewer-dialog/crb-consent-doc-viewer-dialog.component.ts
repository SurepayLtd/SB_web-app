import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface CrbDocViewerData {
  title: string;
  subtitle?: string;
  blobUrl: string;
  fileName?: string;
}

@Component({
  selector: 'mifosx-crb-consent-doc-viewer-dialog',
  templateUrl: './crb-consent-doc-viewer-dialog.component.html',
  styleUrls: ['./crb-consent-doc-viewer-dialog.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class CrbConsentDocViewerDialogComponent {
  dialogRef = inject<MatDialogRef<CrbConsentDocViewerDialogComponent>>(MatDialogRef);
  private sanitizer = inject(DomSanitizer);
  data = inject<CrbDocViewerData>(MAT_DIALOG_DATA);

  safeUrl: SafeResourceUrl;

  constructor() {
    // Only blob: URLs we created ourselves are trusted
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.blobUrl);
  }

  close(): void {
    this.dialogRef.close();
  }

  download(): void {
    if (!this.data.blobUrl) return;

    const link = document.createElement('a');
    link.href = this.data.blobUrl;
    link.download = this.data.fileName ?? 'CRB_Consent_Document.pdf';
    link.click();
  }

  print(): void {
    // Hidden iframe — print without navigating away from the app
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = this.data.blobUrl;

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        setTimeout(() => iframe.remove(), 60_000);
      }
    };

    document.body.appendChild(iframe);
  }
}
