"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
/**
 * Servicio para la internacionalización de la aplicación.
 *
 * @author Robert Ene
 */
var i18nService = (function () {
    function i18nService() {
    }
    i18nService.prototype.getLocale = function () {
        var locale = localStorage.getItem('localeId');
        return locale;
    };
    i18nService.prototype.setLocale = function (locale) {
        localStorage.setItem('localeId', locale);
    };
    return i18nService;
}());
i18nService = __decorate([
    core_1.Injectable()
], i18nService);
exports.i18nService = i18nService;
//# sourceMappingURL=i18n.service.js.map