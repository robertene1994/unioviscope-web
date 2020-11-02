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
var FileSaver = require("file-saver");
var error_handler_service_1 = require("./../../shared/error-handler/error-handler.service");
var login_service_1 = require("./../../shared/login/service/login.service");
var admin_service_1 = require("./../shared/service/admin.service");
var messages_service_1 = require("./../../shared/service/messages/messages.service");
var severity_message_1 = require("./../../shared/types/severity-message");
/**
 * Componente para la pantalla de mantenimiento de sesiones del administrador.
 *
 * @author Robert Ene
 */
var SessionComponent = SessionComponent_1 = (function () {
    function SessionComponent(loginService, adminService, messagesService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.displayFormat = false;
    }
    SessionComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    SessionComponent.prototype.ngOnInit = function () {
        this.getUrl();
        this.getSessions();
    };
    Object.defineProperty(SessionComponent.prototype, "fileName", {
        get: function () {
            return SessionComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionComponent.prototype, "dateFormat", {
        get: function () {
            return SessionComponent_1.dateFormat;
        },
        enumerable: true,
        configurable: true
    });
    SessionComponent.prototype.getUrl = function () {
        this.url = this.adminService.getAdminUrl(SessionComponent_1.session);
    };
    SessionComponent.prototype.getSessions = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.sessions = [];
            this.adminService
                .getSessions()
                .then(function (sessions) {
                _this.sessions = sessions;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SessionComponent.prototype.deleteSession = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteSession(this.selectedSession.id)
                .then(function () {
                var index = _this.sessions.indexOf(_this.selectedSession, 0);
                if (index > -1) {
                    _this.selectedSession = null;
                    _this.sessions.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, '¡La sesión seleccionada ha sido eliminada correctamente!');
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SessionComponent.prototype.updateSession = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    SessionComponent.prototype.createSession = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    SessionComponent.prototype.deleteOrUpdateSessionButtonState = function () {
        return this.selectedSession === undefined || this.selectedSession === null ? true : false;
    };
    SessionComponent.prototype.onBeforeSend = function (event) {
        this.adminService.setImportRequestHeaders(event.xhr);
    };
    SessionComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    SessionComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    SessionComponent.prototype.onUpload = function (event) {
        var file = this.adminService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Las sesiones del fichero han sido importadas correctamente!');
                this.getSessions();
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n        \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    return SessionComponent;
}());
SessionComponent.session = 'session';
SessionComponent.fileName = 'sessions';
SessionComponent.dateFormat = 'dd/MM/yyyy HH:mm';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SessionComponent.prototype, "beforeunloadHandler", null);
SessionComponent = SessionComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'session',
        templateUrl: './session.component.html',
        styleUrls: ['./session.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], SessionComponent);
exports.SessionComponent = SessionComponent;
var SessionComponent_1;
//# sourceMappingURL=session.component.js.map