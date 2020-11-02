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
 * Componente para la pantalla de mantenimiento de planes de estudios del administrador.
 *
 * @author Robert Ene
 */
var SyllabusComponent = SyllabusComponent_1 = (function () {
    function SyllabusComponent(loginService, adminService, messagesService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.displayFormat = false;
    }
    SyllabusComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    SyllabusComponent.prototype.ngOnInit = function () {
        this.getUrl();
        this.getSyllabuses();
    };
    Object.defineProperty(SyllabusComponent.prototype, "fileName", {
        get: function () {
            return SyllabusComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    SyllabusComponent.prototype.getUrl = function () {
        this.url = this.adminService.getAdminUrl(SyllabusComponent_1.syllabus);
    };
    SyllabusComponent.prototype.getSyllabuses = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.syllabuses = [];
            this.adminService
                .getSyllabuses()
                .then(function (syllabuses) {
                _this.syllabuses = syllabuses;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SyllabusComponent.prototype.deleteSyllabus = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteSyllabus(this.selectedSyllabus.id)
                .then(function () {
                var index = _this.syllabuses.indexOf(_this.selectedSyllabus, 0);
                if (index > -1) {
                    _this.selectedSyllabus = null;
                    _this.syllabuses.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, '¡El plan de estudios seleccionado ha sido eliminado correctamente!');
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SyllabusComponent.prototype.updateSyllabus = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    SyllabusComponent.prototype.createSyllabus = function () {
        this.messagesService.showMessage(severity_message_1.warn, '¡Funcionalidad no implementada!');
    };
    SyllabusComponent.prototype.deleteOrUpdateSyllabusButtonState = function () {
        return this.selectedSyllabus === undefined || this.selectedSyllabus === null ? true : false;
    };
    SyllabusComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    SyllabusComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    SyllabusComponent.prototype.onBeforeSend = function (event) {
        this.adminService.setImportRequestHeaders(event.xhr);
    };
    SyllabusComponent.prototype.onUpload = function (event) {
        var file = this.adminService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Los planes de estudios del fichero han sido importados correctamente!');
                this.getSyllabuses();
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n        \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    return SyllabusComponent;
}());
SyllabusComponent.syllabus = 'syllabus';
SyllabusComponent.fileName = 'syllabuses';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SyllabusComponent.prototype, "beforeunloadHandler", null);
SyllabusComponent = SyllabusComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'syllabus',
        templateUrl: './syllabus.component.html',
        styleUrls: ['./syllabus.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], SyllabusComponent);
exports.SyllabusComponent = SyllabusComponent;
var SyllabusComponent_1;
//# sourceMappingURL=syllabus.component.js.map