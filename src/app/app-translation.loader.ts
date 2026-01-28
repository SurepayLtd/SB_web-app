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
