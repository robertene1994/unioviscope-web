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
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var error_handler_service_1 = require("./../../../shared/error-handler/error-handler.service");
var login_service_1 = require("./../../../shared/login/service/login.service");
var teacher_service_1 = require("./../../shared/service/teacher.service");
var messages_service_1 = require("./../../../shared/service/messages/messages.service");
var calendar_locale_1 = require("./../../shared/model/calendar-locale/calendar-locale");
var severity_message_1 = require("./../../../shared/types/severity-message");
/**
 * Componente para la pantalla de los detalles de una sesión determinada del docente.
 *
 * @author Robert Ene
 */
var SessionDetailsComponent = (function () {
    function SessionDetailsComponent(router, route, loginService, teacherService, messagesService, errorHandlerService) {
        this.router = router;
        this.route = route;
        this.loginService = loginService;
        this.teacherService = teacherService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.locale = new calendar_locale_1.CalendarLocale();
        this.locale.firstDayOfWeek = 1;
        this.locale.dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        this.locale.dayNamesShort = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        this.locale.dayNamesMin = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        this.locale.monthNames = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];
        this.locale.monthNamesShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }
    SessionDetailsComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    SessionDetailsComponent.prototype.ngOnInit = function () {
        this.user = this.loginService.getLoggedUser();
        this.getSession();
        this.getSessionLocations();
        this.currentLocation = this.session.location;
        this.currentDescription = this.session.description;
    };
    SessionDetailsComponent.prototype.getSession = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            if (params['session']) {
                var session = JSON.parse(atob(params['session']));
                _this.session = session;
                _this.startDate = new Date(_this.session.start);
                _this.endDate = new Date(_this.session.end);
            }
        });
    };
    SessionDetailsComponent.prototype.getSessionLocations = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.locations = [];
            this.locationsSI = [];
            this.teacherService
                .getSessionLocations(this.session.group.subject.subject.id)
                .then(function (locations) {
                _this.locations = locations;
                for (var i = 0; i < locations.length; i++) {
                    _this.locationsSI.push({ label: locations[i], value: locations[i] });
                }
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SessionDetailsComponent.prototype.goBack = function () {
        this.router.navigate(['attendanceProcess']);
    };
    SessionDetailsComponent.prototype.createSession = function () {
        var _this = this;
        this.session.start = this.startDate.getTime();
        this.session.end = this.endDate.getTime();
        this.session.description = this.currentDescription;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .saveSession(this.session)
                .then(function (session) {
                _this.session = session;
                _this.currentLocation = _this.session.location;
                _this.messagesService.showMessage(severity_message_1.info, "\u00A1La sesi\u00F3n ha sido creada correctamente! \n            En este momento, es posible modificar los datos de la sesi\u00F3n creada!");
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SessionDetailsComponent.prototype.updateSession = function () {
        var _this = this;
        this.session.start = this.startDate.getTime();
        this.session.end = this.endDate.getTime();
        this.session.description = this.currentDescription;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .updateSession(this.session)
                .then(function (session) {
                _this.session = session;
                _this.currentLocation = _this.session.location;
                _this.messagesService.showMessage(severity_message_1.info, '¡Los datos de la sesión han sido modificados correctamente!');
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    SessionDetailsComponent.prototype.openAttendanceProcess = function () {
        this.router.navigate(['/qrCodeProcess', btoa(JSON.stringify(this.session))]);
    };
    SessionDetailsComponent.prototype.createOrUpdateSessionButtonState = function () {
        if (this.startDate !== undefined &&
            this.startDate.getTime() === this.session.start &&
            this.endDate !== undefined &&
            this.endDate.getTime() === this.session.end &&
            this.currentLocation !== undefined &&
            this.currentLocation === this.session.location &&
            this.currentDescription !== undefined &&
            (this.currentDescription.length === 0 || this.currentDescription === this.session.description)) {
            return true;
        }
        return false;
    };
    SessionDetailsComponent.prototype.openAttendanceProcessButtonState = function () {
        var currentDate = new Date().getTime();
        // return (this.session.start <= currentDate && currentDate <= this.session.end) ? false : true;
        return false;
    };
    return SessionDetailsComponent;
}());
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SessionDetailsComponent.prototype, "beforeunloadHandler", null);
SessionDetailsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'session-details',
        templateUrl: './session-details.component.html',
        styleUrls: ['./session-details.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.Router,
        router_1.ActivatedRoute,
        login_service_1.LoginService,
        teacher_service_1.TeacherService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService])
], SessionDetailsComponent);
exports.SessionDetailsComponent = SessionDetailsComponent;
//# sourceMappingURL=session-details.component.js.map