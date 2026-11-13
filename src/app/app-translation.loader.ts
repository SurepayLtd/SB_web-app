/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { HttpClient } from '@angular/common/http';
import { LocationStrategy } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Creates a new TranslateHttpLoader.
 * @param {HttpClient} http HttpClient.
 * @param {LocationStrategy} locationStrategy Location Strategy.
 * @returns {TranslateHttpLoader} Returns a new TranslateHttpLoader.
 */
export function appTranslationLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/translations/', '.json');
}
