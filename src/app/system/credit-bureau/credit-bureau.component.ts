import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mifosx-credit-bureau',
  templateUrl: './credit-bureau.component.html',
  styleUrls: ['./credit-bureau.component.scss']
})
export class CreditBureauComponent implements OnInit {
  /**
   * Credit Bureau Providers.
   * Contains the list of credit bureau providers retrieved by the route resolver.
   */
  creditBureauProviders: any[] = [];

  /**
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Angular Router.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.route.data.subscribe((data: any) => {
      this.creditBureauProviders = data.creditBureauProviders || [];
    });
  }

  /** Initializes the Credit Bureau component.*/
  ngOnInit(): void {}

  /**
   * Navigates to the organisations configured for the selected credit bureau provider.
   */
  viewOrganisations(creditBureau: any): void {
    if (!creditBureau?.creditBureauId) {
      return;
    }

    this.router.navigate([creditBureau.creditBureauId, 'organisations'],
      { relativeTo: this.route }
    );
  }
}
