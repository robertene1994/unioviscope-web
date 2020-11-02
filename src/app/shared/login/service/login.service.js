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
var CryptoJS = require("crypto-js");
var angular2_jwt_1 = require("angular2-jwt");
var http_service_1 = require("./../../service/http/http.service");
var error_handler_service_1 = require("./../../error-handler/error-handler.service");
var app_config_1 = require("./../../../app.config");
/**
 * Servicios necesarios para el inicio de la sesión en el sistema.
 *
 * @author Robert Ene
 */
var LoginService = (function () {
    function LoginService(http, errorHandlerService) {
        this.http = http;
        this.errorHandlerService = errorHandlerService;
    }
    LoginService.prototype.logIn = function (account) {
        var _this = this;
        return this.http.post(app_config_1.apiUrlCommon + '/logIn', JSON.stringify(account))
            .then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            var token = response.headers.get('Authorization');
            if (token) {
                localStorage.setItem('token', JSON.stringify(token));
            }
        }).then(function () { return _this.loadUserDetails(account); })
            .catch(function (error) { return _this.errorHandlerService.handleExpiredSessionError(error); });
    };
    LoginService.prototype.getLoggedUser = function () {
        var encodedStringUser = localStorage.getItem('user');
        if (encodedStringUser) {
            var token = localStorage.getItem('token');
            var encodedUser = JSON.parse(encodedStringUser);
            var decodedUser = CryptoJS.AES.decrypt(encodedUser.toString(), token);
            return JSON.parse(decodedUser.toString(CryptoJS.enc.Utf8));
        }
    };
    LoginService.prototype.isUserLoggedIn = function () {
        return localStorage.getItem('user')
            && localStorage.getItem('token') && angular2_jwt_1.tokenNotExpired();
    };
    LoginService.prototype.logOut = function () {
        var _this = this;
        if (this.qrCodeProcess) {
            this.qrCodeProcess.stopQrCodeProcessFromOutside().then(function () {
                _this.removeUserSession();
                _this.qrCodeProcess = undefined;
            });
        }
        else {
            this.removeUserSession();
        }
    };
    LoginService.prototype.setQrCodeProcess = function (qrCodeProcess) {
        this.qrCodeProcess = qrCodeProcess;
    };
    LoginService.prototype.removeUserSession = function () {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };
    LoginService.prototype.loadUserDetails = function (account) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('userName', account.userName);
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.getAuth(app_config_1.apiUrlCommon + '/findUserDetails', options)
            .then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            var token = localStorage.getItem('token');
            var user = response.json();
            _this.errorHandlerService.handleUserRoleException(user);
            var stringUser = JSON.stringify(user);
            var encodedUser = CryptoJS.AES.encrypt(stringUser, token);
            localStorage.setItem('user', JSON.stringify(encodedUser.toString()));
        });
    };
    return LoginService;
}());
LoginService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_service_1.HttpService,
        error_handler_service_1.ErrorHandlerService])
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map