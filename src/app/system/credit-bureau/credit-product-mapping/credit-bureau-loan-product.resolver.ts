import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SystemService } from '../../system.service';

@Injectable({
  providedIn: 'root'
})
export class CreditBureauLoanProductResolver implements Resolve<boolean> {

  /**
   * @param {SystemService} systemService System Service.
   */
  constructor(private systemService: SystemService) {}

  /**
   * Retrieves a mapping using its loan product ID.
   *
   * @param {ActivatedRouteSnapshot} route Activated Route Snapshot.
   * @returns {Observable<any>} Selected loan product mapping.
   */
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const loanProductId = route.paramMap.get('loanProductId') || route.parent?.paramMap.get('loanProductId');

    return this.systemService.fetchMappingByLoanProductId(loanProductId);
  }
}
