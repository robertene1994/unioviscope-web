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
var messages_service_1 = require("./../service/messages/messages.service");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var login_service_1 = require("./service/login.service");
var error_handler_service_1 = require("./../error-handler/error-handler.service");
var account_1 = require("./../model/account/account");
var role_1 = require("./../types/role");
/**
 * Componente de la pantalla para el inicio de sesión.
 *
 * @author Robert Ene
 */
var LoginComponent = (function () {
    function LoginComponent(router, loginService, errorHandlerService, messagesService) {
        this.router = router;
        this.loginService = loginService;
        this.errorHandlerService = errorHandlerService;
        this.messagesService = messagesService;
        this.account = new account_1.Account();
    }
    LoginComponent.prototype.logIn = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.loginService
                .logIn(this.account)
                .then(function () {
                var user = _this.loginService.getLoggedUser();
                if (user) {
                    if (user.role === role_1.admin) {
                        _this.router.navigate(['/syllabus']);
                    }
                    else if (user.role === role_1.teacher) {
                        _this.router.navigate(['/attendanceProcess']);
                    }
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    LoginComponent.prototype.logInButtonState = function () {
        if (this.account === undefined ||
            this.account.userName === undefined ||
            this.account.userName.length === 0 ||
            this.account.password === undefined ||
            this.account.password.length === 0) {
            return true;
        }
        return false;
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        login_service_1.LoginService,
        error_handler_service_1.ErrorHandlerService,
        messages_service_1.MessagesService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map