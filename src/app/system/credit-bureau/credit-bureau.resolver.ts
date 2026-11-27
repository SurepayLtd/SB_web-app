import { inject, Injectable } from '@angular/core';
import {
  Router, Resolve,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { SystemService } from '../system.service';

@Injectable({
  providedIn: 'root'
})
export class CreditBureauResolver implements Resolve<Object> {
  private systemService = inject(SystemService);

  constructor() {}

  /**
   * Returns the Bureau data.
   * @returns {Observable<any>}
   */
  resolve(): Observable<any> {
    return this.systemService.getCreditBureauProviders();
  }
}
