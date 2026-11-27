import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'mifosx-credit-bureau',
  templateUrl: './credit-bureau.component.html',
  styleUrls: ['./credit-bureau.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatButtonModule,
    MatDialogModule,
    MatDivider,
    MatIcon,
  ]
})
export class CreditBureauComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /**
   * Credit Bureau Providers.
   * Contains the list of credit bureau providers retrieved by the route resolver.
   */
  creditBureauProviders: any[] = [];


  constructor() {
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
