import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import { getTranslationProviders } from './app/shared/i18n/i18n-providers';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));

// getTranslationProviders().then(providers => {
//   const options = { providers };
//   platformBrowserDynamic().bootstrapModule(AppModule, options);
// });
