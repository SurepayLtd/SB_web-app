
import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../system.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../../settings/settings.service';

@Component({
  selector: 'mifosx-credit-product-mapping',
  templateUrl: './credit-product-mapping.component.html',
  styleUrls: ['./credit-product-mapping.component.scss']
})
export class CreditProductMappingComponent implements OnInit {

  /**
   * Loan Product Mapping Form.
   */
  mappingForm: UntypedFormGroup;

  /**
   * Available loan products retrieved from the system.
   */
  loanProducts: any[] = [];

  /**
   * Existing Loan Product Mapping Data.
   *
   * Populated when the component is opened in edit mode.
   */
  mapping: any;

  /**
   * Organisation Credit Bureau ID.
   *
   * Identifies the organisation credit bureau configuration
   * to which the loan product mapping belongs.
   */
  organisationBureauId: string;

  /**
   * Indicates whether the loan product mapping request is being submitted.
   */
  isSubmitting = false;

  /**
   * Indicates whether available loan products are being loaded.
   */
  isLoading = false;

  /**
   * Indicates the current form mode.
   *
   * Create mode creates a new mapping, while edit mode updates
   * an existing mapping.
   */
  mode: 'create' | 'edit';

  /** Existing loan product mappings for the organisation credit bureau. */
  mappings: any[] = [];

  /**
   * @param {ActivatedRoute} route Activated Route.
   * @param {SystemService} systemService System Service.
   * @param {UntypedFormBuilder} formBuilder Form Builder.
   * @param {SettingsService} settingsService Settings Service.
   * @param {Router} router Angular Router.
   */
  constructor(
    private route: ActivatedRoute,
    private systemService: SystemService,
    private formBuilder: UntypedFormBuilder,
    private settingsService: SettingsService,
    private router: Router
  ) {
    const parentRoute = this.route.parent;

    this.mode = this.route.snapshot.data['mode'] || 'create';
    this.mapping = this.route.snapshot.data['mapping'];

    const pageData = parentRoute?.snapshot.data['pageData'];

    this.organisationBureauId = pageData?.organisationCreditBureauId?.toString();

    this.mappings = pageData?.mappings || [];

  }

  /**
   * Initializes the mapping form, retrieves route data
   * and loads available loan products.
   */
  ngOnInit(): void {
    this.createMappingForm();

    const loanProductControl = this.mappingForm.get('loanProductId');

    if (this.mode === 'edit') {
      loanProductControl?.disable();
    } else {
      loanProductControl?.enable();
    }

    this.loadLoanProducts();
  }

  /**
   * Loads available loan products.
   *
   * In create mode, excludes products that already have a mapping
   * for the current organisation credit bureau.
   * In edit mode, retains all products so the existing selection remains available.
   */
  loadLoanProducts(): void {
    this.isLoading = true;

    this.systemService.fetchLoanProducts().subscribe({
      next: (response: any) => {
        const products = Array.isArray(response)
          ? response
          : response?.pageItems || [];

        if (this.mode === 'create') {
          const mappedProductIds = new Set(
            this.mappings.map((mapping: any) => Number(mapping.loanProductId))
          );

          this.loanProducts = products.filter(
            (product: any) => !mappedProductIds.has(Number(product.loanProductId))
          );
        } else {
          this.loanProducts = products;
        }

        this.isLoading = false;

        if (this.mode === 'edit' && this.mapping) {
          this.populateForm(this.mapping);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Failed to load loan products:', error);
      }
    });
  }

  /**
   * Initializes the Loan Product Mapping Form.
   */
  /**
   * Creates the loan product mapping form.
   */
  createMappingForm(): void {
    this.mappingForm = this.formBuilder.group({
      loanProductId: [
        {
          value: '',
          disabled: this.mode === 'edit'
        },
        Validators.required
      ],
      isCreditcheckMandatory: [false],
      skipCreditcheckInFailure: [true],
      stalePeriod: [30, [Validators.required, Validators.min(0)]],
      isActive: [true]
    });
  }

  /**
   * Populates the mapping form with the existing mapping details.
   *
   * @param mapping Existing credit bureau loan product mapping.
   */
  populateForm(mapping: any): void {
    if (!mapping || !this.loanProducts.length) {
      return;
    }
    const loanProductId = Number(mapping.loanProductId);

    const loanProductExists = this.loanProducts.some(
      (loanProduct: any) => Number(loanProduct.loanProductId) === loanProductId
    );

    if (!loanProductExists) {
      console.warn('Mapped loan product was not found:', mapping.loanProductId);
      return;
    }

    this.mappingForm.patchValue({
      loanProductId,
      isCreditcheckMandatory: mapping.isCreditCheckMandatory,
      skipCreditcheckInFailure: mapping.skipCrediCheckInFailure,
      stalePeriod: mapping.stalePeriod,
      isActive: mapping.active
    });
  }

  /**
   * Submits the Credit Bureau Loan Product Mapping form.
   *
   * Creates a new mapping or updates an existing mapping depending
   * on the current form mode.
   *
   */
  submit(): void {
    if (this.mappingForm.invalid || this.isSubmitting) {
      this.mappingForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload = {
      ...this.mappingForm.getRawValue(),
      locale: this.settingsService.language.code
    };

    const request$ = this.mode === 'edit'
      ? this.systemService.updateCreditBureauLoanProductMapping({
        ...payload,
        creditbureauLoanProductMappingId: this.mapping.creditbureauLoanProductMappingId
      })
      : this.systemService.createCreditBureauLoanProductMapping(this.organisationBureauId, payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        const commands = this.mode === 'create' ? ['../../'] : ['../../../'];

        this.router.navigate(commands, { relativeTo: this.route });
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Navigates back to the organisation credit bureau page.
   */
  cancel(): void {
    this.returnToOrganisation();
  }

  /**
   * Returns to the organisation page containing the loan product mappings.
   */
  private returnToOrganisation(): void {
    const commands = this.mode === 'create' ? ['../../'] : ['../../../'];

    this.router.navigate(commands, {
      relativeTo: this.route
    });
  }

}
