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
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var Rx_1 = require("rxjs/Rx");
var FileSaver = require("file-saver");
var error_handler_service_1 = require("./../../shared/error-handler/error-handler.service");
var login_service_1 = require("./../../shared/login/service/login.service");
var teacher_service_1 = require("./../shared/service/teacher.service");
var i18n_service_1 = require("./../../shared/i18n/service/i18n.service");
var messages_service_1 = require("./../../shared/service/messages/messages.service");
var attendance_options_1 = require("./../shared/model/attendance-options/attendance-options");
var attendance_dto_1 = require("./../shared/model/attendance-dto/attendance-dto");
var severity_message_1 = require("./../../shared/types/severity-message");
var export_format_1 = require("./../../shared/types/export-format");
/**
 * Componente para la pantalla de exportación y revisión de asistencias del docente.
 *
 * @author Robert Ene
 */
var AttendanceReviewExportComponent = AttendanceReviewExportComponent_1 = (function () {
    function AttendanceReviewExportComponent(router, loginService, teacherService, i18nService, errorHandlerService, messagesService) {
        this.router = router;
        this.loginService = loginService;
        this.teacherService = teacherService;
        this.i18nService = i18nService;
        this.errorHandlerService = errorHandlerService;
        this.messagesService = messagesService;
        this.displayFormat = false;
    }
    AttendanceReviewExportComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    AttendanceReviewExportComponent.prototype.ngOnInit = function () {
        this.datePipe = new common_1.DatePipe(this.i18nService.getLocale());
        this.user = this.loginService.getLoggedUser();
        this.getUrl();
        this.getFormats();
        this.getSubjects();
    };
    Object.defineProperty(AttendanceReviewExportComponent.prototype, "fileName", {
        get: function () {
            return AttendanceReviewExportComponent_1.fileName;
        },
        enumerable: true,
        configurable: true
    });
    AttendanceReviewExportComponent.prototype.getUrl = function () {
        this.url = this.teacherService.getTeacherUrl(AttendanceReviewExportComponent_1.attendance);
    };
    AttendanceReviewExportComponent.prototype.getFormats = function () {
        this.formatsSI = [];
        this.formatsSI.push({ label: 'Excel', value: export_format_1.xlsx });
    };
    AttendanceReviewExportComponent.prototype.getSubjects = function () {
        var _this = this;
        this.subjectsSI = [];
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .getSubjects(this.user.id)
                .then(function (subjects) {
                for (var i = 0; i < subjects.length; i++) {
                    _this.subjectsSI.push({ label: subjects[i].denomination, value: subjects[i].id });
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    AttendanceReviewExportComponent.prototype.getGroups = function () {
        var _this = this;
        this.groupsSI = [];
        this.sessionsSI = [];
        this.selectedGroup = null;
        this.selectedSession = null;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .getGroups(this.user.id, this.selectedSubject)
                .then(function (groups) {
                _this.groupsSI.push({ label: 'Todos', value: -1 });
                for (var i = 0; i < groups.length; i++) {
                    _this.groupsSI.push({ label: groups[i].code, value: groups[i].id });
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    AttendanceReviewExportComponent.prototype.getSessions = function () {
        var _this = this;
        this.sessionsSI = [];
        this.selectedSession = null;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .getSessions(this.user.id, this.selectedSubject, this.selectedGroup)
                .then(function (sessions) {
                _this.sessions = sessions;
                _this.sessionsSI = [];
                _this.sessionsSI.push({ label: 'Todas', value: -1 });
                for (var i = 0; i < _this.sessions.length; i++) {
                    var startDate = new Date(_this.sessions[i].start);
                    _this.sessionsSI.push({
                        label: _this.datePipe.transform(startDate, 'dd/MM/yyyy HH:mm') + ' / ' + _this.sessions[i].location,
                        value: _this.sessions[i].id,
                    });
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    AttendanceReviewExportComponent.prototype.getAttendances = function () {
        var _this = this;
        this.exportOptions = new attendance_options_1.AttendanceOptions();
        this.exportOptions.teacherId = this.user.id;
        this.exportOptions.subjectId = this.selectedSubject;
        this.exportOptions.groupId = this.selectedGroup;
        this.exportOptions.sessionId = this.selectedSession;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .getAttendances(this.exportOptions)
                .then(function (attendances) {
                _this.attendances = [];
                _this.modifiedAttendances = [];
                _this.attendances = attendances;
                _this.getStudentNaturalGroups();
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    AttendanceReviewExportComponent.prototype.modifyAttendance = function (attendance) {
        var index = this.modifiedAttendances.indexOf(attendance);
        if (index === -1 && attendance.comment.length === 0) {
            this.messagesService.showMessage(severity_message_1.warn, "\u00A1Introduzca un comentario que indique las razones \n        del cambio realizado sobre la asistencia del alumno!");
        }
        else if (index !== -1) {
            this.modifiedAttendances.splice(index);
        }
        else {
            this.modifiedAttendances.push(attendance);
        }
    };
    AttendanceReviewExportComponent.prototype.updateAttendances = function () {
        var _this = this;
        var observables = [];
        this.modifiedAttendances.forEach(function (attendance) {
            var attendanceDto = new attendance_dto_1.AttendanceDto();
            attendanceDto.comment = attendance.comment;
            attendanceDto.confirmed = attendance.confirmed;
            attendanceDto.student = attendance.student.id;
            attendanceDto.session = attendance.session.id;
            observables.push(_this.teacherService.updateAttendance(attendanceDto));
        });
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            Rx_1.Observable.forkJoin(observables).subscribe(function (result) {
                _this.messagesService.showMessage(severity_message_1.info, '¡Los datos de las asistencias han sido modificadas correctamente!');
                _this.getAttendances();
            });
        }
    };
    AttendanceReviewExportComponent.prototype.exportAttendances = function () {
        var _this = this;
        this.exportOptions = new attendance_options_1.AttendanceOptions();
        this.exportOptions.format = this.selectedFormat;
        this.exportOptions.teacherId = this.user.id;
        this.exportOptions.subjectId = this.selectedSubject;
        this.exportOptions.groupId = this.selectedGroup;
        this.exportOptions.sessionId = this.selectedSession;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .exportAttendances(this.exportOptions)
                .then(function (exportFile) {
                if (exportFile && exportFile.size !== 0) {
                    FileSaver.saveAs(exportFile, exportFile.name);
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    AttendanceReviewExportComponent.prototype.showFormatDialog = function () {
        this.displayFormat = true;
    };
    AttendanceReviewExportComponent.prototype.hideFormatDialog = function () {
        this.displayFormat = false;
    };
    AttendanceReviewExportComponent.prototype.onBeforeSend = function (event) {
        this.teacherService.setImportRequestHeaders(event.xhr);
    };
    AttendanceReviewExportComponent.prototype.onUpload = function (event) {
        var file = this.teacherService.processImportResponse(event.xhr);
        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(severity_message_1.info, '¡Las asistencias del fichero han sido importados correctamente!');
                if (!this.exportAttendancesButtonState()) {
                    this.getAttendances();
                }
            }
            else {
                this.messagesService.showMessage(severity_message_1.error, "\u00A1El fichero importado contiene inconsistencias! \n        \u00A1Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!");
                FileSaver.saveAs(file, file.name);
            }
        }
    };
    AttendanceReviewExportComponent.prototype.exportAttendancesButtonState = function () {
        return this.selectedFormat === undefined || this.selectedSession === undefined || this.selectedSession === null ? true : false;
    };
    AttendanceReviewExportComponent.prototype.getAttendancesButtonState = function () {
        return this.selectedSession === undefined || this.selectedSession === null ? true : false;
    };
    AttendanceReviewExportComponent.prototype.updateAttendancesButtonState = function () {
        return this.modifiedAttendances === undefined || this.modifiedAttendances.length === 0 ? true : false;
    };
    AttendanceReviewExportComponent.prototype.getStudentNaturalGroups = function () {
        var _this = this;
        this.attendances.forEach(function (attendance) {
            _this.teacherService
                .getStudentNaturalGroup(attendance.student.id, attendance.session.group.type, attendance.session.group.subject.course.id, attendance.session.group.subject.subject.id)
                .then(function (studentGroup) {
                attendance.student.studentGroup = studentGroup;
            });
        });
    };
    return AttendanceReviewExportComponent;
}());
AttendanceReviewExportComponent.attendance = 'attendance';
AttendanceReviewExportComponent.fileName = 'attendances';
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AttendanceReviewExportComponent.prototype, "beforeunloadHandler", null);
AttendanceReviewExportComponent = AttendanceReviewExportComponent_1 = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'attendance-review-export',
        templateUrl: './attendance-review-export.component.html',
        styleUrls: ['./attendance-review-export.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        login_service_1.LoginService,
        teacher_service_1.TeacherService,
        i18n_service_1.i18nService,
        error_handler_service_1.ErrorHandlerService,
        messages_service_1.MessagesService])
], AttendanceReviewExportComponent);
exports.AttendanceReviewExportComponent = AttendanceReviewExportComponent;
var AttendanceReviewExportComponent_1;
//# sourceMappingURL=attendance-review-export.component.js.map