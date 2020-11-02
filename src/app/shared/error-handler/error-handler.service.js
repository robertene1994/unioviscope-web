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
var Rx_1 = require("rxjs/Rx");
var messages_service_1 = require("./../service/messages/messages.service");
var role_1 = require("./../types/role");
var severity_message_1 = require("./../types/severity-message");
/**
 * Servicio que sirve como manejador central para los errores.
 *
 * @author Robert Ene
 */
var ErrorHandlerService = (function () {
    function ErrorHandlerService(messagesService) {
        this.messagesService = messagesService;
    }
    ErrorHandlerService.prototype.handleExpiredSessionError = function (error) {
        if (error.message === 'No JWT present or has expired') {
            throw new Error('¡El nombre de usuario o la contraseña introducidos son incorrectos!');
        }
        throw error;
    };
    ErrorHandlerService.prototype.handleExceptionResponse = function (response) {
        if (response.text()) {
            var exception = response.json();
            if (exception.field && exception.exception) {
                throw new Error('¡' + exception.message + '!');
            }
        }
    };
    ErrorHandlerService.prototype.handleImportExceptionResponse = function (response) {
        if (response.responseText &&
            response.responseText.length !== 0 &&
            response.responseText.indexOf('exception') !== -1 &&
            response.responseText.indexOf('message') !== -1) {
            var exception = JSON.parse(response.responseText);
            this.messagesService.showMessage(severity_message_1.error, '¡' + exception.message + '!');
            return false;
        }
        return true;
    };
    ErrorHandlerService.prototype.handleExportExceptionResponse = function (response) {
        var blob = response.json();
        if (blob.type === 'application/json') {
            this.messagesService.showMessage(severity_message_1.error, '¡Ha ocurrido un error inesperado al procesar el fichero que se exportaba!');
            return false;
        }
        return true;
    };
    ErrorHandlerService.prototype.handleTimeOutError = function () {
        return Rx_1.Observable.throw(new Error("\u00A1El servicio no est\u00E1 disponible en estos momentos! \n      \u00A1Por favor, pruebe de nuevo pasados unos minutos!"));
    };
    ErrorHandlerService.prototype.handleUserRoleException = function (user) {
        if (user.role === role_1.student) {
            throw new Error('¡Solo se permite el acceso a los profesores y administradores del sistema!');
        }
    };
    ErrorHandlerService.prototype.handleNoInternetConnectionError = function () {
        if (!navigator.onLine) {
            this.messagesService.showMessage(severity_message_1.error, '¡No hay una conexión a Internet!');
            return false;
        }
        return true;
    };
    ErrorHandlerService.prototype.handleError = function (e) {
        if (e.message) {
            this.messagesService.showMessage(severity_message_1.error, e.message);
        }
    };
    return ErrorHandlerService;
}());
ErrorHandlerService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], ErrorHandlerService);
exports.ErrorHandlerService = ErrorHandlerService;
//# sourceMappingURL=error-handler.service.js.map