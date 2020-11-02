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
var teacher_group_key_1 = require("./../../shared/types/key/teacher-group-key");
var severity_message_1 = require("./../../shared/types/severity-message");
/**
 * Componente para la pantalla de mantenimiento de asignaciones de docentes a grupos del administrador.
 *
 * @author Robert Ene
 */
var TeacherGroupComponent = TeacherGroupComponent_1 = (function () {
    function TeacherGroupComponent(loginService, adminService, messagesService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.displayFormat = false;
    }
    TeacherGroupComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    TeacherGroupComponent.prototype.ngOnInit = function () {
        this.getUrl();
        this.getTeacherGroups();
    };
    Object.defineProperty(TeacherGroupComponent.prototype, "fileName", {
        get: function () {
            return TeacherGroupComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    TeacherGroupComponent.prototype.getUrl = function () {
        this.url = this.adminService.getAdminUrl(TeacherGroupComponent_1.teacherGroup);
    };
    TeacherGroupComponent.prototype.getTeacherGroups = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherGroups = [];
            this.adminService
                .getTeacherGroups()
                .then(function (teacherGroups) {
                _this.teacherGroups = teacherGroups;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    TeacherGroupComponent.prototype.deleteTeacherGroup = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            var teacherGroupKey = new teacher_group_key_1.TeacherGroupKey();
            teacherGroupKey.teacher = this.selectedTeacherGroup.teacher.id;
            teacherGroupKey.group = this.selectedTeacherGroup.group.id;
            this.adminService
                .deleteTeacherGroup(teacherGroupKey)
                .then(function () {
                var index = _this.teacherGroups.indexOf(_this.selectedTeacherGroup, 0);
                if (index > -1) {
                    _this.selectedTeacherGroup = null;
                    _this.teacherGroups.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, '¡La asignación del docente al grupo seleccionado ha sido eliminada correctamente!');
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    TeacherGroupComponent.prototype.updateTeacherGroup = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    TeacherGroupComponent.prototype.createTeacherGroup = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    TeacherGroupComponent.prototype.deleteOrUpdateTeacherGroupButtonState = function () {
        return this.selectedTeacherGroup === undefined || this.selectedTeacherGroup === null ? true : false;
    };
    TeacherGroupComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    TeacherGroupComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    TeacherGroupComponent.prototype.onBeforeSend = function (event) {
        this.adminService.setImportRequestHeaders(event.xhr);
    };
    TeacherGroupComponent.prototype.onUpload = function (event) {
        var file = this.adminService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Las asignaciones de los docentes a los grupos han sido importadas correctamente!');
                this.getTeacherGroups();
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n        \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    return TeacherGroupComponent;
}());
TeacherGroupComponent.teacherGroup = 'teacherGroup';
TeacherGroupComponent.fileName = 'teacherGroups';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TeacherGroupComponent.prototype, "beforeunloadHandler", null);
TeacherGroupComponent = TeacherGroupComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'teacher-group',
        templateUrl: './teacher-group.component.html',
        styleUrls: ['./teacher-group.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], TeacherGroupComponent);
exports.TeacherGroupComponent = TeacherGroupComponent;
var TeacherGroupComponent_1;
//# sourceMappingURL=teacher-group.component.js.map