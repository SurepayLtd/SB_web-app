import { APP_INITIALIZER, FactoryProvider, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';

/**
 * An APP_INITIALIZER provider to load the default language and translations.
 *
 * @param translate The TranslateService.
 * @param injector The Injector.
 * @returns A promise that resolves when the translations are loaded.
 */
function appInitializerFactory(translate: TranslateService, injector: Injector): () => Promise<any> {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
      locationInitialized.then(() => {
        const langToSet = 'en'; // Set the default language here
        translate.setDefaultLang(langToSet);
        translate.use(langToSet).subscribe(
          () => {
            console.info(`Successfully initialized '${langToSet}' language.`);
          },
          (err) => {
            console.error(`Problem with '${langToSet}' language initialization.'`);
          },
          () => {
            resolve(null);
          }
        );
      });
    });
}

/**
 * The APP_INITIALIZER provider for translations.
 */
export const translationInitializer: FactoryProvider = {
  provide: APP_INITIALIZER,
  useFactory: appInitializerFactory,
  deps: [
    TranslateService,
    Injector
  ],
  multi: true
};
