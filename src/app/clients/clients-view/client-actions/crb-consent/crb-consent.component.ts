import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../clients.service';
import { SettingsService } from '../../../../settings/settings.service';

@Component({
  selector: 'mifosx-crb-consent',
  templateUrl: './crb-consent.component.html',
  styleUrls: ['./crb-consent.component.scss']
})
export class CrbConsentComponent implements OnInit {


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

  readonly consentText = 'I consent to the verification of my identity and personal information through the Credit Reference Bureau for the purposes of this application.';


  /**
   * @param {FormBuilder} formBuilder Form Builder
   * @param {ClientsService} clientsService Clients Service
   * @param {ActivatedRoute} route Activated Route
   * @param {Router} router Router
   * @param {SettingsService} settingsService Settings Service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private clientsService: ClientsService,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.clientId = this.route.parent.snapshot.params['clientId'];
  }


  /**
   * Initializes the CRB consent form and loads available channels.
   */
  ngOnInit(): void {
    this.createCrbConsentForm();
    this.loadConsentTemplate();
  }

  /**
   * Creates the CRB consent form.
   */
  createCrbConsentForm(): void {
    this.crbConsentForm = this.formBuilder.group({
      consentChannel: ['', Validators.required],
      consentText: [this.consentText, Validators.required]
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
      }
    });
  }

  /**
   * Submits the CRB consent request.
   */
  submit(): void {
    if (this.crbConsentForm.invalid || this.isSubmitting) {
      this.crbConsentForm.markAllAsTouched();
      return;
    }

    const formData = this.crbConsentForm.value;
    const locale = this.settingsService.language.code;
    const dateFormat = this.settingsService.dateFormat;

    const data = {
      ...formData,
      consentChannel: Number(formData.consentChannel),
      dateFormat,
      locale
    };

    this.isSubmitting = true;

    this.clientsService.createCrbConsent(this.clientId, data).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['../../'], { relativeTo: this.route });
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

}
