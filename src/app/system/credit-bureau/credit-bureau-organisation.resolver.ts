import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { SystemService } from '../system.service';
import { switchMap } from 'rxjs/internal/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreditBureauOrganisationResolver implements Resolve<boolean> {

  /**
   * @param {SystemService} systemService System service for credit bureau API requests.
   */
  constructor(private systemService: SystemService) {}

  /**
   * Retrieves the organisation configuration and then its loan product mappings.
   *
   * @param {ActivatedRouteSnapshot} route Current activated route.
   * @returns {Observable<any>} Organisation configuration and associated mappings.
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const creditBureauId = route.paramMap.get('creditBureauId') || route.parent?.paramMap.get('creditBureauId');

    if (!creditBureauId) {
      return throwError(() => new Error('Credit Bureau ID was not provided.'));
    }

    return this.systemService.getOrganisationCreditBureau(creditBureauId).pipe(
      switchMap((organisations: any[]) => {
        if (!organisations || organisations.length === 0) {
          return throwError(() => new Error('No organisation configuration found.'));
        }

        const organisation = organisations[0];
        const organisationCreditBureauId = organisation.organisationCreditBureauId;

        if (!organisationCreditBureauId) {
          return throwError(() => new Error('Organisation Credit Bureau ID was not returned.'));
        }

        return this.systemService.getCreditBureauLoanProductMapping(organisationCreditBureauId)
          .pipe(map((mappings: any[]) => ({ organisation, mappings: mappings || [], organisationCreditBureauId }))
          );
      })
    );
  }

}
