import { Injectable } from '@angular/core';
import {ClientsService} from '../clients.service';
import {
  Resolve,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientCrbConsentResolver implements Resolve<boolean> {


  constructor(private clientsService: ClientsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const clientId = route.paramMap.get('clientId') || route.parent?.paramMap.get('clientId');
    return this.clientsService.getCrbConsent(clientId);
  }
}
