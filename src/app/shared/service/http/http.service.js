"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
var i18n_service_1 = require("./../../i18n/service/i18n.service");
var error_handler_service_1 = require("./../../error-handler/error-handler.service");
var app_config_1 = require("./../../../app.config");
/**
 * Servicios para las peticiones realizadas contra la API de UniOviSCOPE,
 * tanto autenticadas como no.
 *
 * @author Robert Ene
 */
var HttpService = (function () {
    function HttpService(http, httpAuth, i18nService, errorHandlerService) {
        this.http = http;
        this.httpAuth = httpAuth;
        this.i18nService = i18nService;
        this.errorHandlerService = errorHandlerService;
    }
    HttpService.prototype.post = function (url, body, options) {
        return this.http
            .post(url, body, options)
            .timeoutWith(app_config_1.serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError())
            .toPromise();
    };
    HttpService.prototype.getAuth = function (url, options) {
        return this.httpAuth.get(url, options).timeoutWith(app_config_1.serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError()).toPromise();
    };
    HttpService.prototype.postAuth = function (url, body, options) {
        return this.httpAuth
            .post(url, body, options)
            .timeoutWith(app_config_1.serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError())
            .toPromise();
    };
    HttpService.prototype.putAuth = function (url, body, options) {
        return this.httpAuth
            .put(url, body, options)
            .timeoutWith(app_config_1.serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError())
            .toPromise();
    };
    HttpService.prototype.deleteAuth = function (url, options) {
        return this.httpAuth
            .delete(url, options)
            .timeoutWith(app_config_1.serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError())
            .toPromise();
    };
    HttpService.prototype.setImportRequestHeaders = function (request) {
        request.setRequestHeader('Authorization', JSON.parse(localStorage.getItem('token')));
        request.setRequestHeader('Accept-Language', this.i18nService.getLocale());
    };
    HttpService.prototype.processImportResponse = function (request) {
        return new File([request.responseText], request.getResponseHeader('X-Filename'));
    };
    return HttpService;
}());
HttpService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        angular2_jwt_1.AuthHttp,
        i18n_service_1.i18nService,
        error_handler_service_1.ErrorHandlerService])
], HttpService);
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map