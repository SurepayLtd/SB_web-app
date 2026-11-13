/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Injectable, inject } from '@angular/core';
import { ClientsService } from '../clients.service';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientCrbConsentResolver implements Resolve<boolean> {
  private clientsService = inject(ClientsService);

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const clientId = route.paramMap.get('clientId') || route.parent?.paramMap.get('clientId');
    return this.clientsService.getCrbConsent(clientId);
  }
}
