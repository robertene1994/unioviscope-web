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
 * Componente para la pantalla de mantenimiento de asignaturas del administrador.
 *
 * @author Robert Ene
 */
var SubjectComponent = SubjectComponent_1 = (function () {
    function SubjectComponent(loginService, adminService, messagesService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.displayFormat = false;
    }
    SubjectComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    SubjectComponent.prototype.ngOnInit = function () {
        this.getUrl();
        this.getSubjects();
    };
    Object.defineProperty(SubjectComponent.prototype, "fileName", {
        get: function () {
            return SubjectComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    SubjectComponent.prototype.getUrl = function () {
        this.url = this.adminService.getAdminUrl(SubjectComponent_1.subject);
    };
    SubjectComponent.prototype.getSubjects = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.subjects = [];
            this.adminService
                .getSubjects()
                .then(function (subjects) {
                _this.subjects = subjects;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SubjectComponent.prototype.deleteSubject = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteSubject(this.selectedSubject.id)
                .then(function () {
                var index = _this.subjects.indexOf(_this.selectedSubject, 0);
                if (index > -1) {
                    _this.selectedSubject = null;
                    _this.subjects.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, '¡La asignatura seleccionada ha sido eliminada correctamente!');
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SubjectComponent.prototype.updateSubject = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    SubjectComponent.prototype.createSubject = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    SubjectComponent.prototype.deleteOrUpdateSubjectButtonState = function () {
        return this.selectedSubject === undefined || this.selectedSubject === null ? true : false;
    };
    SubjectComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    SubjectComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    SubjectComponent.prototype.onBeforeSend = function (event) {
        this.adminService.setImportRequestHeaders(event.xhr);
    };
    SubjectComponent.prototype.onUpload = function (event) {
        var file = this.adminService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Las asignaturas del fichero han sido importadas correctamente!');
                this.getSubjects();
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n          \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    return SubjectComponent;
}());
SubjectComponent.subject = 'subject';
SubjectComponent.fileName = 'subjects';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubjectComponent.prototype, "beforeunloadHandler", null);
SubjectComponent = SubjectComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'subject',
        templateUrl: './subject.component.html',
        styleUrls: ['./subject.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], SubjectComponent);
exports.SubjectComponent = SubjectComponent;
var SubjectComponent_1;
//# sourceMappingURL=subject.component.js.map