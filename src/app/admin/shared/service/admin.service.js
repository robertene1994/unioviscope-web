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
var error_handler_service_1 = require("./../../../shared/error-handler/error-handler.service");
var http_service_1 = require("./../../../shared/service/http/http.service");
var app_config_1 = require("./../../../app.config");
/**
 * Servicios para las funcionalidades ofrecidas para el administrador.
 *
 * @author Robert Ene
 */
var AdminService = (function () {
    function AdminService(http, errorHandlerService) {
        this.http = http;
        this.errorHandlerService = errorHandlerService;
    }
    AdminService.prototype.getSyllabuses = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlSyllabus + '/findAll').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.deleteSyllabus = function (syllabusId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('id', syllabusId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlSyllabus + '/deleteById', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getCourses = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlCourseSubject + '/findAllWithSyllabus').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.getLastCourse = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlCourse + '/findLast').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.createNextCourse = function () {
        var _this = this;
        var options = new http_1.RequestOptions();
        return this.http.postAuth(app_config_1.apiUrlCourseSubject + '/createNextForAll', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.deleteLastCourse = function (courseYear, syllabusId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('year', courseYear.toString());
        params.set('syllabusId', syllabusId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlCourseSubject + '/deleteByYearAndSyllabus', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getSubjects = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlSubject + '/findAll').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.deleteSubject = function (subjectId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('id', subjectId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlSubject + '/deleteById', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getGroups = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlGroup + '/findAll').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.deleteGroup = function (groupId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('id', groupId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlGroup + '/deleteById', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getTeachers = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlTeachers + '/findAll').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.deleteTeacher = function (teacherId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('id', teacherId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlTeachers + '/deleteById', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getStudents = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlStudents + '/findAll').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.deleteStudent = function (studentId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('id', studentId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlStudents + '/deleteById', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getSessions = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlSession + '/findAll').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.deleteSession = function (sessionId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('id', sessionId.toString());
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlSession + '/deleteById', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getTeacherGroups = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlTeacherGroup + '/findAll').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.deleteTeacherGroup = function (teacherGroupId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('id', JSON.stringify(teacherGroupId));
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlTeacherGroup + '/deleteById', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getStudentGroups = function () {
        var _this = this;
        return this.http.getAuth(app_config_1.apiUrlStudentGroup + '/findAll').then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
            return response.json();
        });
    };
    AdminService.prototype.deleteStudentGroup = function (studentGroupId) {
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('id', JSON.stringify(studentGroupId));
        var options = new http_1.RequestOptions();
        options.search = params;
        return this.http.deleteAuth(app_config_1.apiUrlStudentGroup + '/deleteById', options).then(function (response) {
            _this.errorHandlerService.handleExceptionResponse(response);
        });
    };
    AdminService.prototype.getAdminUrl = function (type) {
        var url;
        switch (type) {
            case 'syllabus':
                url = app_config_1.apiUrlSyllabus;
                break;
            case 'subject':
                url = app_config_1.apiUrlSubject;
                break;
            case 'group':
                url = app_config_1.apiUrlGroup;
                break;
            case 'teacher':
                url = app_config_1.apiUrlTeachers;
                break;
            case 'student':
                url = app_config_1.apiUrlStudents;
                break;
            case 'session':
                url = app_config_1.apiUrlSession;
                break;
            case 'teacherGroup':
                url = app_config_1.apiUrlTeacherGroup;
                break;
            case 'studentGroup':
                url = app_config_1.apiUrlStudentGroup;
                break;
            default:
                break;
        }
        return (url += '/import');
    };
    AdminService.prototype.setImportRequestHeaders = function (request) {
        this.http.setImportRequestHeaders(request);
    };
    AdminService.prototype.processImportResponse = function (request) {
        if (this.errorHandlerService.handleImportExceptionResponse(request)) {
            return this.http.processImportResponse(request);
        }
    };
    return AdminService;
}());
AdminService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_service_1.HttpService, error_handler_service_1.ErrorHandlerService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map