import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoansService } from '../loans.service';

@Injectable({
  providedIn: 'root'
})
export class CreditScoreResolver implements Resolve<boolean> {
  constructor(private loansService: LoansService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const loanId = route.paramMap.get('loanId') || route.parent?.paramMap.get('loanId');

    return this.loansService.getCrbScore(loanId);
  }
}
