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
var student_group_key_1 = require("./../../shared/types/key/student-group-key");
var severity_message_1 = require("./../../shared/types/severity-message");
/**
 * Componente para la pantalla de mantenimiento de asignaciones de estudiantes a grupos del administrador.
 *
 * @author Robert Ene
 */
var StudentGroupComponent = StudentGroupComponent_1 = (function () {
    function StudentGroupComponent(loginService, adminService, messagesService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.displayFormat = false;
    }
    StudentGroupComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    StudentGroupComponent.prototype.ngOnInit = function () {
        this.getUrl();
        this.getStudentGroups();
    };
    Object.defineProperty(StudentGroupComponent.prototype, "fileName", {
        get: function () {
            return StudentGroupComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    StudentGroupComponent.prototype.getUrl = function () {
        this.url = this.adminService.getAdminUrl(StudentGroupComponent_1.studentGroup);
    };
    StudentGroupComponent.prototype.getStudentGroups = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.studentGroups = [];
            this.adminService
                .getStudentGroups()
                .then(function (studentGroups) {
                _this.studentGroups = studentGroups;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    StudentGroupComponent.prototype.deleteStudentGroup = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            var studentGroupKey = new student_group_key_1.StudentGroupKey();
            studentGroupKey.student = this.selectedStudentGroup.student.id;
            studentGroupKey.group = this.selectedStudentGroup.group.id;
            this.adminService
                .deleteStudentGroup(studentGroupKey)
                .then(function () {
                var index = _this.studentGroups.indexOf(_this.selectedStudentGroup, 0);
                if (index > -1) {
                    _this.selectedStudentGroup = null;
                    _this.studentGroups.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, '¡La asignación del estudiante al grupo seleccionado ha sido eliminada correctamente!');
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    StudentGroupComponent.prototype.updateStudentGroup = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    StudentGroupComponent.prototype.createStudentGroup = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    StudentGroupComponent.prototype.deleteOrUpdateStudentGroupButtonState = function () {
        return this.selectedStudentGroup === undefined || this.selectedStudentGroup === null ? true : false;
    };
    StudentGroupComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    StudentGroupComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    StudentGroupComponent.prototype.onBeforeSend = function (event) {
        this.adminService.setImportRequestHeaders(event.xhr);
    };
    StudentGroupComponent.prototype.onUpload = function (event) {
        var file = this.adminService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Las asignaciones de los estudiantes a los grupos han sido importadas correctamente!');
                this.getStudentGroups();
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n        \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    return StudentGroupComponent;
}());
StudentGroupComponent.studentGroup = 'studentGroup';
StudentGroupComponent.fileName = 'studentGroups';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentGroupComponent.prototype, "beforeunloadHandler", null);
StudentGroupComponent = StudentGroupComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'student-group',
        templateUrl: './student-group.component.html',
        styleUrls: ['./student-group.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], StudentGroupComponent);
exports.StudentGroupComponent = StudentGroupComponent;
var StudentGroupComponent_1;
//# sourceMappingURL=student-group.component.js.map