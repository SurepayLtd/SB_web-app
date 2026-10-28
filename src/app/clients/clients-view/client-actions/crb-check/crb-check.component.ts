import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from 'app/clients/clients.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { SettingsService } from '../../../../settings/settings.service';


@Component({
  selector: 'mifosx-crb-check',
  templateUrl: './crb-check.component.html',
  styleUrls: ['./crb-check.component.scss']
})
export class CrbCheckComponent implements OnInit {

  clientId: any;

  requestTypes: any[] = [];
  validationTypes: any[] = [];

  selectedRequestType: number | null = null;
  selectedValidationType: number | null = null;

  isLoading = false;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientsService: ClientsService,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService
  ) {
    this.clientId = this.route.parent?.snapshot.paramMap.get('clientId') ??
      this.route.snapshot.paramMap.get('clientId');
  }

  ngOnInit(): void {
    this.loadTemplate();
  }

  loadTemplate(): void {
    this.isLoading = true;

    this.clientsService.getCrbCheckTemplate()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: any) => {
          const template = Array.isArray(response)
            ? response[0]
            : response;

          this.requestTypes = template?.requestTypes ?? [];
          this.validationTypes = template?.validationTypes ?? [];

          this.selectedRequestType = this.requestTypes[0]?.id ?? null;

          this.selectedValidationType = this.validationTypes[0]?.id ?? null;
        },
        error: () => {
          this.snackBar.open('Failed to load CRB validation types.', 'Close', { duration: 4000 });
        }
      });
  }

  submitCheck(): void {
    if (!this.clientId || this.selectedRequestType == null || this.selectedValidationType == null) {
      this.snackBar.open('Select a request type and validation type.', 'Close', { duration: 3000 });
      return;
    }
    this.isSubmitting = true;

    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;


    const data = {
      crbValidationType: Number(this.selectedValidationType),
      crbRequestType: Number(this.selectedRequestType),
      locale,
      dateFormat
    }

    this.clientsService.createCrbCheck(this.clientId, data)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.snackBar.open('CRB validation request completed.', 'Close',
            { duration: 3000 }
          );
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.snackBar.open(error?.error?.defaultUserMessage ?? error?.error?.developerMessage ?? 'CRB validation failed.',
            'Close',
            { duration: 5000 }
          );
        }
      });
  }

  cancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

}
