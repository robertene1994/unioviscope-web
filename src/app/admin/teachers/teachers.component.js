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
 * Componente para la pantalla de mantenimiento de docentes del administrador.
 *
 * @author Robert Ene
 */
var TeachersComponent = TeachersComponent_1 = (function () {
    function TeachersComponent(loginService, adminService, messagesService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.displayFormat = false;
    }
    TeachersComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    TeachersComponent.prototype.ngOnInit = function () {
        this.getUrl();
        this.getTeachers();
    };
    Object.defineProperty(TeachersComponent.prototype, "fileName", {
        get: function () {
            return TeachersComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    TeachersComponent.prototype.getUrl = function () {
        this.url = this.adminService.getAdminUrl(TeachersComponent_1.teacher);
    };
    TeachersComponent.prototype.getTeachers = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teachers = [];
            this.adminService
                .getTeachers()
                .then(function (teachers) {
                _this.teachers = teachers;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    TeachersComponent.prototype.deleteTeacher = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteTeacher(this.selectedTeacher.id)
                .then(function () {
                var index = _this.teachers.indexOf(_this.selectedTeacher, 0);
                if (index > -1) {
                    _this.selectedTeacher = null;
                    _this.teachers.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, '¡El docente seleccionado ha sido eliminado correctamente!');
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    TeachersComponent.prototype.updateTeacher = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    TeachersComponent.prototype.createTeacher = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    TeachersComponent.prototype.deleteOrUpdateTeacherButtonState = function () {
        return this.selectedTeacher === undefined || this.selectedTeacher === null ? true : false;
    };
    TeachersComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    TeachersComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    TeachersComponent.prototype.onBeforeSend = function (event) {
        this.adminService.setImportRequestHeaders(event.xhr);
    };
    TeachersComponent.prototype.onUpload = function (event) {
        var file = this.adminService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Los docentes del fichero han sido importados correctamente!');
                this.getTeachers();
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n        \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    return TeachersComponent;
}());
TeachersComponent.teacher = 'teacher';
TeachersComponent.fileName = 'teachers';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeachersComponent.prototype, "beforeunloadHandler", null);
TeachersComponent = TeachersComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'teachers',
        templateUrl: './teachers.component.html',
        styleUrls: ['./teachers.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], TeachersComponent);
exports.TeachersComponent = TeachersComponent;
var TeachersComponent_1;
//# sourceMappingURL=teachers.component.js.map