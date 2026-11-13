/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanOfficeName'
})
export class CleanOfficeNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.replace(/^\.+/, '');
  }
}
