"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var core_1 = require("@angular/core");
var app_module_1 = require("./app/app.module");
var environment_1 = require("./environments/environment");
// import { getTranslationProviders } from './app/shared/i18n/i18n-providers';
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic()
    .bootstrapModule(app_module_1.AppModule)
    .catch(function (err) { return console.error(err); });
// getTranslationProviders().then(providers => {
//   const options = { providers };
//   platformBrowserDynamic().bootstrapModule(AppModule, options);
// });
//# sourceMappingURL=main.js.map