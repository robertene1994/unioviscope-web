"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
var i18n_service_1 = require("./../../i18n/service/i18n.service");
function authHttpServiceFactory(http, options, i18n) {
    return new angular2_jwt_1.AuthHttp(new angular2_jwt_1.AuthConfig({
        tokenName: 'token',
        noTokenScheme: true,
        tokenGetter: function () { return JSON.parse(localStorage.getItem('token')); },
        globalHeaders: [{ 'Content-Type': 'application/json' }, { 'Accept-Language': i18n.getLocale() }],
    }), http, options);
}
exports.authHttpServiceFactory = authHttpServiceFactory;
/**
 * Módulo de autenticación HTTP para las peticiones realizadas contra la API de UniOviSCOPE.
 *
 * @author Robert Ene
 */
var AuthModule = (function () {
    function AuthModule() {
    }
    return AuthModule;
}());
AuthModule = __decorate([
    core_1.NgModule({
        providers: [
            {
                provide: angular2_jwt_1.AuthHttp,
                useFactory: authHttpServiceFactory,
                deps: [http_1.Http, http_1.RequestOptions, i18n_service_1.i18nService],
            },
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map