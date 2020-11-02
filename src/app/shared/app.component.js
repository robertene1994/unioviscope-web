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
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var login_service_1 = require("./login/service/login.service");
var messages_service_1 = require("./service/messages/messages.service");
var i18n_service_1 = require("./i18n/service/i18n.service");
var app_config_1 = require("./../app.config");
/**
 * Componente principal (raíz) de la aplicación.
 *
 * @author Robert Ene
 */
var AppComponent = AppComponent_1 = (function () {
    function AppComponent(router, location, i18nService, zone, messagesService, loginService) {
        this.router = router;
        this.location = location;
        this.i18nService = i18nService;
        this.zone = zone;
        this.messagesService = messagesService;
        this.loginService = loginService;
        this.messages = [];
        this.languages = [];
        this.languages.push({ label: 'Español', value: 'es-ES' });
        this.languages.push({ label: 'Inglés', value: 'en-US' });
    }
    AppComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.messagesService.setContainer(this.messages);
        this.selectedLocale = this.i18nService.getLocale();
        if (!this.selectedLocale) {
            this.selectedLocale = app_config_1.defaultLocale;
            this.i18nService.setLocale(app_config_1.defaultLocale);
        }
        this.location.onPopState(function () {
            if (_this.location.pathname === '/login') {
                _this.loginService.logOut();
            }
        });
    };
    Object.defineProperty(AppComponent.prototype, "showErrorTime", {
        get: function () {
            return AppComponent_1.showErrorTime;
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.logOut = function () {
        this.loginService.logOut();
        this.router.navigate(['login']);
    };
    AppComponent.prototype.changeLanguage = function (event) {
        this.i18nService.setLocale(event.value);
        this.zone.runOutsideAngular(function () {
            location.reload();
        });
    };
    return AppComponent;
}());
AppComponent.showErrorTime = app_config_1.showErrorTimeIntervalSeconds * 1000;
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppComponent.prototype, "beforeunloadHandler", null);
AppComponent = AppComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'uniovi-scope-app',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        common_1.PlatformLocation,
        i18n_service_1.i18nService,
        core_1.NgZone,
        messages_service_1.MessagesService,
        login_service_1.LoginService])
], AppComponent);
exports.AppComponent = AppComponent;
var AppComponent_1;
//# sourceMappingURL=app.component.js.map