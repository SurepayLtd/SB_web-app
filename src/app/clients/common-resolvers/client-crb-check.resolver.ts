import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClientsService } from '../clients.service';

@Injectable({
  providedIn: 'root'
})
export class ClientCrbCheckResolver implements Resolve<boolean> {

  constructor(private clientsService: ClientsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const clientId = route.paramMap.get('clientId') || route.parent?.paramMap.get('clientId');
    return this.clientsService.getCrbCheckHistory(clientId);
  }
}
