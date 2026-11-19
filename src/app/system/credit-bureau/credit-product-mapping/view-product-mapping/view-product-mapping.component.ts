import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mifosx-view-product-mapping',
  templateUrl: './view-product-mapping.component.html',
  styleUrls: ['./view-product-mapping.component.scss']
})
export class ViewProductMappingComponent implements OnInit {
  /**
   * Credit Bureau Loan Product Mapping details.
   * Contains the mapping configuration retrieved by the route resolver.
   */
  mapping: any;

  /**
   * Creates an instance of ViewProductMappingComponent.
   *
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Angular Router.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.data.subscribe((data: any) => {
      this.mapping = data.mapping;
    });
  }

  /**
   * Initializes the View Product Mapping component.
   */
  ngOnInit(): void {}

  /**
   * Navigates to the edit form for the currently selected loan product mapping.
   *
   * Uses the loan product ID to identify the mapping to be edited.
   *
   * @returns {void}
   */
  editMapping(): void {
    if (!this.mapping?.loanProductId) {
      return;
    }

    this.router.navigate(['../../', this.mapping.loanProductId, 'edit'],
      { relativeTo: this.route }
    );
  }
}
