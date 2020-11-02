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
var primeng_1 = require("primeng/primeng");
var error_handler_service_1 = require("./../../shared/error-handler/error-handler.service");
var login_service_1 = require("./../../shared/login/service/login.service");
var admin_service_1 = require("./../shared/service/admin.service");
var messages_service_1 = require("./../../shared/service/messages/messages.service");
var severity_message_1 = require("./../../shared/types/severity-message");
/**
 * Componente para la pantalla de mantenimiento de cursos del administrador.
 *
 * @author Robert Ene
 */
var CourseComponent = (function () {
    function CourseComponent(loginService, adminService, messagesService, confirmationService, errorHandlerService) {
        this.loginService = loginService;
        this.adminService = adminService;
        this.messagesService = messagesService;
        this.confirmationService = confirmationService;
        this.errorHandlerService = errorHandlerService;
    }
    CourseComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    CourseComponent.prototype.ngOnInit = function () {
        this.minYear = 0;
        this.maxYear = 0;
        this.getLastCourse();
        this.getCourses();
    };
    CourseComponent.prototype.getLastCourse = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .getLastCourse()
                .then(function (course) {
                _this.lastCourse = course;
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    CourseComponent.prototype.getCourses = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.courses = [];
            this.adminService
                .getCourses()
                .then(function (courses) {
                _this.courses = courses;
                _this.getMinMaxYear();
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    CourseComponent.prototype.deleteLastCourse = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            var courseYear = this.selectedCourse.course.year;
            var syllabusId = this.selectedCourse.subject.syllabus.id;
            this.adminService
                .deleteLastCourse(courseYear, syllabusId)
                .then(function () {
                var index = _this.courses.indexOf(_this.selectedCourse, 0);
                if (index > -1) {
                    _this.selectedCourse = null;
                    _this.courses.splice(index, 1);
                    _this.messagesService.showMessage(severity_message_1.info, '¡El curso académico ha sido eliminado correctamente!');
                }
                if (_this.courses.length === 0) {
                    _this.ngOnInit();
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    CourseComponent.prototype.createNextCourse = function () {
        var _this = this;
        this.adminService.createNextCourse().then(function () {
            var startCourse = _this.lastCourse.year + 1;
            var endCourse = startCourse + 1;
            _this.messagesService.showMessage(severity_message_1.info, '¡El curso académico ' + startCourse + ' - ' + endCourse + ' ha sido creado correctamente!');
            _this.selectedCourse = null;
            _this.minYear = 0;
            _this.maxYear = 0;
            _this.getLastCourse();
            _this.getCourses();
        });
    };
    CourseComponent.prototype.showDialogCreateNextCourse = function () {
        var _this = this;
        var startCourse = this.lastCourse.year + 1;
        var endCourse = startCourse + 1;
        this.confirmationService.confirm({
            header: 'Confirmación nuevo curso académico',
            message: '¿Está seguro de que desea crear el curso académico ' +
                startCourse +
                ' - ' +
                endCourse +
                ' para todos los planes de estudios?',
            accept: function () {
                _this.createNextCourse();
            },
        });
    };
    CourseComponent.prototype.deleteCourseButtonState = function () {
        return this.selectedCourse === undefined || this.selectedCourse === null ? true : false;
    };
    CourseComponent.prototype.getMinMaxYear = function () {
        var _this = this;
        if (this.courses.length > 0) {
            this.minYear = this.courses[0].course.year;
            this.maxYear = this.courses[0].course.year;
            this.courses.forEach(function (course) {
                _this.minYear = course.course.year < _this.minYear ? course.course.year : _this.minYear;
                _this.maxYear = course.course.year > _this.maxYear ? course.course.year : _this.maxYear;
            });
        }
    };
    return CourseComponent;
}());
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CourseComponent.prototype, "beforeunloadHandler", null);
CourseComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'course',
        templateUrl: './course.component.html',
        styleUrls: ['./course.component.css'],
    }),
    __metadata("design:paramtypes", [login_service_1.LoginService,
        admin_service_1.AdminService,
        messages_service_1.MessagesService,
        primeng_1.ConfirmationService,
        error_handler_service_1.ErrorHandlerService])
], CourseComponent);
exports.CourseComponent = CourseComponent;
//# sourceMappingURL=course.component.js.map