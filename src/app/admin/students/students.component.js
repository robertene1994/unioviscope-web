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
 * Componente para la pantalla de mantenimiento de estudiantes del administrador.
 *
 * @author Robert Ene
 */
var StudentsComponent = StudentsComponent_1 = (function () {
    function StudentsComponent(loginService, adminService, messagesService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.displayFormat = false;
    }
    StudentsComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    StudentsComponent.prototype.ngOnInit = function () {
        this.getUrl();
        this.getStudents();
    };
    Object.defineProperty(StudentsComponent.prototype, "fileName", {
        get: function () {
            return StudentsComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    StudentsComponent.prototype.getUrl = function () {
        this.url = this.adminService.getAdminUrl(StudentsComponent_1.student);
    };
    StudentsComponent.prototype.getStudents = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.students = [];
            this.adminService
                .getStudents()
                .then(function (students) {
                _this.students = students;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    StudentsComponent.prototype.deleteStudent = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteStudent(this.selectedStudent.id)
                .then(function () {
                var index = _this.students.indexOf(_this.selectedStudent, 0);
                if (index > -1) {
                    _this.selectedStudent = null;
                    _this.students.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, '¡El estudiante seleccionado ha sido eliminado correctamente!');
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    StudentsComponent.prototype.updateStudent = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    StudentsComponent.prototype.createStudent = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    StudentsComponent.prototype.deleteOrUpdateStudentButtonState = function () {
        return this.selectedStudent === undefined || this.selectedStudent === null ? true : false;
    };
    StudentsComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    StudentsComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    StudentsComponent.prototype.onBeforeSend = function (event) {
        this.adminService.setImportRequestHeaders(event.xhr);
    };
    StudentsComponent.prototype.onUpload = function (event) {
        var file = this.adminService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Los estudiantes del fichero han sido importados correctamente!');
                this.getStudents();
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n        \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    return StudentsComponent;
}());
StudentsComponent.student = 'student';
StudentsComponent.fileName = 'students';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsComponent.prototype, "beforeunloadHandler", null);
StudentsComponent = StudentsComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'students',
        templateUrl: './students.component.html',
        styleUrls: ['./students.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], StudentsComponent);
exports.StudentsComponent = StudentsComponent;
var StudentsComponent_1;
//# sourceMappingURL=students.component.js.map