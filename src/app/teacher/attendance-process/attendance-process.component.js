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
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var error_handler_service_1 = require("./../../shared/error-handler/error-handler.service");
var messages_service_1 = require("./../../shared/service/messages/messages.service");
var login_service_1 = require("./../../shared/login/service/login.service");
var teacher_service_1 = require("./../shared/service/teacher.service");
var i18n_service_1 = require("./../../shared/i18n/service/i18n.service");
var severity_message_1 = require("./../../shared/types/severity-message");
/**
 * Componente para la pantalla de configuración y apertura del control de presencia del docente.
 *
 * @author Robert Ene
 */
var AttendanceProcessComponent = (function () {
    function AttendanceProcessComponent(location, router, loginService, i18nService, teacherService, messagesService, errorHandlerService) {
        this.location = location;
        this.router = router;
        this.loginService = loginService;
        this.i18nService = i18nService;
        this.teacherService = teacherService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
    }
    AttendanceProcessComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    AttendanceProcessComponent.prototype.ngOnInit = function () {
        this.isOngoingSesions = false;
        this.datePipe = new common_1.DatePipe(this.i18nService.getLocale());
        this.user = this.loginService.getLoggedUser();
        this.getSubjects();
    };
    AttendanceProcessComponent.prototype.getSubjects = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.subjectsSI = [];
            this.teacherService
                .getSubjects(this.user.id)
                .then(function (subjects) {
                if (subjects.length === 0) {
                    _this.messagesService.showMessage(severity_message_1.info, '¡No tiene asignaturas asignadas para curso académico actual!');
                }
                else {
                    for (var i = 0; i < subjects.length; i++) {
                        _this.subjectsSI.push({ label: subjects[i].denomination, value: subjects[i].id });
                    }
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    AttendanceProcessComponent.prototype.getGroups = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.groupsSI = [];
            this.sessionsSI = [];
            this.selectedGroup = null;
            this.selectedSession = null;
            this.teacherService
                .getGroups(this.user.id, this.selectedSubject)
                .then(function (groups) {
                if (groups.length === 0) {
                    _this.messagesService.showMessage(severity_message_1.info, '¡No tiene grupos asignados para la asignaturas seleccionada!');
                }
                else {
                    for (var i = 0; i < groups.length; i++) {
                        _this.groupsSI.push({ label: groups[i].code, value: groups[i].id });
                    }
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    AttendanceProcessComponent.prototype.getSessions = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.sessionsSI = [];
            this.selectedSession = null;
            this.teacherService
                .getSessions(this.user.id, this.selectedSubject, this.selectedGroup)
                .then(function (sessions) {
                _this.sessions = sessions;
                if (_this.sessions.length === 0) {
                    _this.messagesService.showMessage(severity_message_1.info, '¡No hay sesiones planificadas para el grupo seleccionado!');
                }
                else {
                    _this.showSessionsForSwitch();
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    AttendanceProcessComponent.prototype.ongoingSessionsSwitchState = function () {
        return this.selectedSubject === undefined ||
            this.selectedSubject === null ||
            this.selectedGroup === undefined ||
            this.selectedGroup === null
            ? true
            : false;
    };
    AttendanceProcessComponent.prototype.goForward = function () {
        this.router.navigate(['/sessionDetails', btoa(JSON.stringify(this.sessions[this.selectedSession]))]);
    };
    AttendanceProcessComponent.prototype.forwardButtonState = function () {
        return this.selectedSession === undefined || this.selectedSession === null ? true : false;
    };
    AttendanceProcessComponent.prototype.showSessionsForSwitch = function () {
        this.sessionsSI = [];
        this.selectedSession = undefined;
        for (var i = 0; i < this.sessions.length; i++) {
            if (this.isOngoingSesions) {
                var currentDate = new Date().getTime();
                if (this.sessions[i].start <= currentDate && currentDate <= this.sessions[i].end) {
                    this.pushSession(i, this.sessions[i]);
                }
            }
            else {
                this.pushSession(i, this.sessions[i]);
            }
        }
    };
    AttendanceProcessComponent.prototype.pushSession = function (index, session) {
        var startDate = new Date(this.sessions[index].start);
        this.sessionsSI.push({
            label: this.datePipe.transform(startDate, 'dd/MM/yyyy HH:mm') + ' / ' + this.sessions[index].location,
            value: index,
        });
    };
    return AttendanceProcessComponent;
}());
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceProcessComponent.prototype, "beforeunloadHandler", null);
AttendanceProcessComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'attendance-process',
        templateUrl: './attendance-process.component.html',
        styleUrls: ['./attendance-process.component.css'],
    }),
    __metadata("design:paramtypes", [common_1.Location,
        router_1.Router,
        login_service_1.LoginService,
        i18n_service_1.i18nService,
        teacher_service_1.TeacherService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], AttendanceProcessComponent);
exports.AttendanceProcessComponent = AttendanceProcessComponent;
//# sourceMappingURL=attendance-process.component.js.map