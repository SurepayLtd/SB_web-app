import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'mifosx-view-product-mapping',
  templateUrl: './view-product-mapping.component.html',
  styleUrls: ['./view-product-mapping.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    FaIconComponent,
  ]
})
export class ViewProductMappingComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  /**
   * Credit Bureau Loan Product Mapping details.
   * Contains the mapping configuration retrieved by the route resolver.
   */
  mapping: any;


  constructor() {
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
