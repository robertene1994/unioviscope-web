"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
function getTranslationProviders() {
    var locale = localStorage.getItem('localeId');
    var noProviders = [];
    if (!locale) {
        return Promise.resolve(noProviders);
    }
    var translationFile = "./lang/messages_" + locale + ".xlf";
    return getTranslationsWithSystemJs(translationFile)
        .then(function (translations) { return [
        { provide: core_1.TRANSLATIONS, useValue: translations },
        { provide: core_1.TRANSLATIONS_FORMAT, useValue: 'xlf' },
        { provide: core_1.LOCALE_ID, useValue: locale },
    ]; })
        .catch(function () { return noProviders; });
}
exports.getTranslationProviders = getTranslationProviders;
function getTranslationsWithSystemJs(file) {
    return System.import(file + '!text');
}
//# sourceMappingURL=i18n-providers.js.map