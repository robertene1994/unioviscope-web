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
var http_1 = require("@angular/http");
var http_service_1 = require("./../../../shared/service/http/http.service");
var error_handler_service_1 = require("./../../../shared/error-handler/error-handler.service");
var app_config_1 = require("./../../../app.config");
/**
 * Servicios para las funcionalidades ofrecidas para el docente.
 *
 * @author Robert Ene
 */
var TeacherService = (function () {
    function TeacherService(http, errorHandlerService) {
        this.http = http;
        this.errorHandlerService = errorHandlerService;
    }
    TeacherService.prototype.getSubjects = function (teacherId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('teacherId', teacherId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.getAuth(app_config_1.apiUrlTeacher + '/findLastYearSubjects', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.getGroups = function (teacherId, subjectId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('teacherId', teacherId.toString());
        params.set('subjectId', subjectId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.getAuth(app_config_1.apiUrlTeacher + '/findLastYearSubjectGroups', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.getSessions = function (teacherId, subjectId, groupId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('teacherId', teacherId.toString());
        params.set('subjectId', subjectId.toString());
        params.set('groupId', groupId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.getAuth(app_config_1.apiUrlTeacher + '/findLastYearSubjectGroupSessions', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.getSessionLocations = function (subjectId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('subjectId', subjectId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.getAuth(app_config_1.apiUrlTeacher + '/findLocationsBySubject', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.getQrCode = function (sessionId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('sessionId', sessionId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        options.responseType = http_1.ResponseContentType.Blob;
        return this.http.getAuth(app_config_1.apiUrlTeacher + '/createQrCodeForSession', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return new Blob([response.blob()], { type: 'image/png' });
        });
    };
    TeacherService.prototype.stopQrCodeProcess = function (sessionId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('sessionId', sessionId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.getAuth(app_config_1.apiUrlTeacher + '/stopQrCodeProcessForSession', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.getAttendancesNo = function (sessionId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('sessionId', sessionId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.getAuth(app_config_1.apiUrlTeacher + '/findAttendancesNoBySession', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.saveSession = function (session) {
        var _this = this;
        return this.http.postAuth(app_config_1.apiUrlSession + '/save', JSON.stringify(session)).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.updateSession = function (session) {
        var _this = this;
        return this.http.putAuth(app_config_1.apiUrlSession + '/update', JSON.stringify(session)).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.exportAttendances = function (attendanceOptions) {
        var _this = this;
        var options = new http_1.RequestOptions();
        options.responseType = http_1.ResponseContentType.Blob;
        return this.http.postAuth(app_config_1.apiUrlTeacher + '/exportAttendances', JSON.stringify(attendanceOptions), options).then(function (response) {
            if (_this.errorHandlerService.handleExportExceptionResponse(response)) {
                return new File([response.blob()], response.headers.get('X-Filename'));
            }
            return new File([], response.headers.get('X-Filename'));
        });
    };
    TeacherService.prototype.getAttendances = function (attendanceOptions) {
        var _this = this;
        return this.http.postAuth(app_config_1.apiUrlTeacher + '/findAttendances', JSON.stringify(attendanceOptions)).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.getStudentNaturalGroup = function (studentId, groupType, courseId, subjectId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('studentId', studentId.toString());
        params.set('groupType', groupType);
        params.set('courseId', courseId.toString());
        params.set('subjectId', subjectId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.getAuth(app_config_1.apiUrlStudentGroup + '/findByStudentAndGroupTypeAndCourseAndSubject', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            if (response.text()) {
                return response.json();
            }
            return null;
        });
    };
    TeacherService.prototype.updateAttendance = function (attendance) {
        var _this = this;
        return this.http.putAuth(app_config_1.apiUrlTeacher + '/updateAttendance', JSON.stringify(attendance)).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    TeacherService.prototype.getTeacherUrl = function (type) {
        var url;
        if (type == 'attendance') {
            url = app_config_1.apiUrlAttendance;
        }
        return (url += '/import');
    };
    TeacherService.prototype.setImportRequestHeaders = function (request) {
        this.http.setImportRequestHeaders(request);
    };
    TeacherService.prototype.processImportResponse = function (request) {
        if (this.errorHandlerService.handleImportExceptionResponse(request)) {
            return this.http.processImportResponse(request);
        }
    };
    return TeacherService;
}());
TeacherService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_service_1.HttpService, error_handler_service_1.ErrorHandlerService])
], TeacherService);
exports.TeacherService = TeacherService;
//# sourceMappingURL=teacher.service.js.map