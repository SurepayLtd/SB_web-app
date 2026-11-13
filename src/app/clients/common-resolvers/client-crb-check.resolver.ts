/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Injectable, inject } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClientsService } from '../clients.service';

@Injectable({
  providedIn: 'root'
})
export class ClientCrbCheckResolver implements Resolve<boolean> {
  private clientsService = inject(ClientsService);

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const clientId = route.paramMap.get('clientId') || route.parent?.paramMap.get('clientId');
    return this.clientsService.getCrbCheckHistory(clientId);
  }
}
