import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemService } from '../../system.service';

@Component({
  selector: 'mifosx-credit-bureau-organisation',
  templateUrl: './credit-bureau-organisation.component.html',
  styleUrls: ['./credit-bureau-organisation.component.scss']
})
export class CreditBureauOrganisationComponent implements OnInit {
  /**
   * Organisation Credit Bureau Data.
   *
   * Represents the single organisation credit bureau configuration
   * selected from the credit bureau organisations list.
   */
  organisation: any;

  /**
   * Loan Product Mappings attached to this Organisation Credit Bureau.
   *
   * An organisation credit bureau can have multiple loan product mappings.
   */
  mappings: any[] = [];

  /**
   * Organisation Credit Bureau ID.
   *
   * Identifies the organisation credit bureau configuration and is used
   * when retrieving, creating and managing its loan product mappings.
   */
  organisationBureauId: any;

  /**
   * Columns displayed in the loan product mappings table.
   */
  displayedColumns: string[] = [
    'loanProductName',
    'creditbureauSummary',
    'mandatory',
    'skipOnFailure',
    'stalePeriod',
    'active',
    'actions'
  ];

  /**
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Angular Router.
   * @param systemService
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private systemService: SystemService
  ) {

    this.route.data.subscribe((data: any) => {
      const pageData = data.pageData;

      this.organisation = pageData.organisation;
      this.organisationBureauId = pageData.organisationCreditBureauId;
    });
  }

  /**
   * Initializes the organisation credit bureau component.
   */
  ngOnInit(): void {
    this.loadMappings();
  }

  /**
   * Navigates to the loan product mapping form to create a new mapping.
   *
   * The organisation credit bureau ID is retained in the parent route.
   */
  addMapping(): void {
    this.router.navigate(['mappings', 'new'], {
        relativeTo: this.route
      }
    );
  }

  /**
   * Navigates to the loan product mapping details page.
   *
   * @param {any} mapping Loan product mapping to view.
   */
  viewMapping(mapping: any): void {
    this.router.navigate(['mappings', mapping.loanProductId, 'view'], {
        relativeTo: this.route
      }
    );
  }

  /**
   * Navigates to the loan product mapping form in edit mode.
   *
   * @param {any} mapping Loan product mapping to edit.
   */
  editMapping(mapping: any): void {
    this.router.navigate(['mappings', mapping.loanProductId, 'edit'], {
        relativeTo: this.route
      }
    );
  }

  /**
   * Retrieves the latest loan product mappings for this organisation credit bureau.
   */
  loadMappings(): void {
    if (!this.organisationBureauId) {
      return;
    }

    this.systemService.getCreditBureauLoanProductMapping(this.organisationBureauId)
      .subscribe({
        next: (mappings: any[]) => {this.mappings = mappings || [];},
        error: (error: any) => {
          console.error('Failed to load loan product mappings:', error);
        }
      });
  }
}
