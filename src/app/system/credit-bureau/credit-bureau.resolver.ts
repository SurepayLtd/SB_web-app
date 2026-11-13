import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SystemService } from '../system.service';

@Injectable({
  providedIn: 'root'
})
export class CreditBureauResolver implements Resolve<Object> {
  /**
   * @param {SystemService} systemService System service.
   */
  constructor(private systemService: SystemService) {}

  /**
   * Returns the Bureau data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.systemService.getCreditBureauProviders();
  }
}
