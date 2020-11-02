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
 * Componente para la pantalla de mantenimiento de grupos del administrador.
 *
 * @author Robert Ene
 */
var GroupComponent = GroupComponent_1 = (function () {
    function GroupComponent(loginService, adminService, messagesService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.displayFormat = false;
    }
    GroupComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    GroupComponent.prototype.ngOnInit = function () {
        this.getUrl();
        this.getGroups();
    };
    Object.defineProperty(GroupComponent.prototype, "fileName", {
        get: function () {
            return GroupComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    GroupComponent.prototype.getUrl = function () {
        this.url = this.adminService.getAdminUrl(GroupComponent_1.group);
    };
    GroupComponent.prototype.getGroups = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.groups = [];
            this.adminService
                .getGroups()
                .then(function (groups) {
                _this.groups = groups;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    GroupComponent.prototype.deleteGroup = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteGroup(this.selectedGroup.id)
                .then(function () {
                var index = _this.groups.indexOf(_this.selectedGroup, 0);
                if (index > -1) {
                    _this.selectedGroup = null;
                    _this.groups.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, 'El grupo seleccionado ha sido eliminado correctamente!');
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    GroupComponent.prototype.updateGroup = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    GroupComponent.prototype.createGroup = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    GroupComponent.prototype.deleteOrUpdateGroupButtonState = function () {
        return this.selectedGroup === undefined || this.selectedGroup === null ? true : false;
    };
    GroupComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    GroupComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    GroupComponent.prototype.onBeforeSend = function (event) {
        this.adminService.setImportRequestHeaders(event.xhr);
    };
    GroupComponent.prototype.onUpload = function (event) {
        var file = this.adminService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Los grupos del fichero han sido importados correctamente!');
                this.getGroups();
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n        \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    return GroupComponent;
}());
GroupComponent.group = 'group';
GroupComponent.fileName = 'groups';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GroupComponent.prototype, "beforeunloadHandler", null);
GroupComponent = GroupComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'group',
        templateUrl: './group.component.html',
        styleUrls: ['./group.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], GroupComponent);
exports.GroupComponent = GroupComponent;
var GroupComponent_1;
//# sourceMappingURL=group.component.js.map