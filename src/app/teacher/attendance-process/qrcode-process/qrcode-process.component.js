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
var platform_browser_1 = require("@angular/platform-browser");
var Rx_1 = require("rxjs/Rx");
var error_handler_service_1 = require("./../../../shared/error-handler/error-handler.service");
var login_service_1 = require("./../../../shared/login/service/login.service");
var teacher_service_1 = require("./../../shared/service/teacher.service");
var messages_service_1 = require("./../../../shared/service/messages/messages.service");
var app_config_1 = require("./../../../app.config");
/**
 * Componente para la pantalla del proceso de confirmación de asistencias del docente.
 *
 * @author Robert Ene
 */
var QrCodeProcessComponent = (function () {
    function QrCodeProcessComponent(route, router, location, loginService, teacherService, messagesService, errorHandlerService, sanitizer) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.location = location;
        this.loginService = loginService;
        this.teacherService = teacherService;
        this.messagesService = messagesService;
        this.errorHandlerService = errorHandlerService;
        this.sanitizer = sanitizer;
        this.loginService.setQrCodeProcess(this);
        this.location.onPopState(function () {
            if (_this.location.pathname.startsWith('/sessionDetails')) {
                _this.stopQrCodeProcess();
            }
        });
    }
    QrCodeProcessComponent.prototype.beforeunloadHandler = function (event) {
        this.loginService.logOut();
    };
    QrCodeProcessComponent.prototype.ngOnInit = function () {
        this.getSession();
        this.isQrPerspective = false;
        this.centerSize = 80;
        this.leftTilt = 80;
        this.upTilt = 70;
        this.rightTilt = 80;
        this.qrCodeTimer = Rx_1.Observable.timer(0, app_config_1.qrCodeRequestIntervalSeconds * 1000);
        this.attendanceNoTimer = Rx_1.Observable.timer(0, app_config_1.attendancesNoRequestIntervalSeconds * 1000);
        this.startQrCodeProcess();
    };
    QrCodeProcessComponent.prototype.getSession = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            if (params['session']) {
                var session = JSON.parse(atob(params['session']));
                _this.session = session;
            }
        });
    };
    QrCodeProcessComponent.prototype.startQrCodeProcess = function () {
        var _this = this;
        this.qrCodeSubscription = this.qrCodeTimer.subscribe(function () {
            if (_this.errorHandlerService.handleNoInternetConnectionError()) {
                _this.teacherService
                    .getQrCode(_this.session.id)
                    .then(function (qrCode) {
                    _this.qrCode = _this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(qrCode));
                })
                    .catch(function (error) { return _this.errorHandlerService.handleError(error); });
            }
        });
        this.attendanceNoSubscription = this.attendanceNoTimer.subscribe(function () {
            if (_this.errorHandlerService.handleNoInternetConnectionError()) {
                _this.teacherService
                    .getAttendancesNo(_this.session.id)
                    .then(function (attendancesNo) {
                    _this.attendancesNo = attendancesNo;
                })
                    .catch(function (error) { return _this.errorHandlerService.handleError(error); });
            }
        });
    };
    QrCodeProcessComponent.prototype.stopQrCodeProcess = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .stopQrCodeProcess(this.session.id)
                .then(function (stopped) {
                _this.unsuscribeTimers();
                _this.router.navigate(['attendanceProcess']);
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    QrCodeProcessComponent.prototype.stopQrCodeProcessFromOutside = function () {
        var _this = this;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            return this.teacherService
                .stopQrCodeProcess(this.session.id)
                .then(function (stopped) {
                _this.unsuscribeTimers();
            })
                .catch(function (error) { return _this.errorHandlerService.handleError(error); });
        }
    };
    QrCodeProcessComponent.prototype.centerPerspective = function () {
        if (!this.isQrPerspective) {
            return this.sanitizer.bypassSecurityTrustStyle('height:' + this.centerSize + 'vh');
        }
        return this.sanitizer.bypassSecurityTrustStyle('height:' + this.centerSize / 2 + 'vh');
    };
    QrCodeProcessComponent.prototype.leftPerspective = function () {
        return this.sanitizer.bypassSecurityTrustStyle('transform: matrix3d(1, 0, 0.00,-' + this.leftTilt / 100000 + ', 0.00, 1, 0.00, 0.000, 0, 0, 1, 0, 0, 0, 0, 1);');
    };
    QrCodeProcessComponent.prototype.upPerspective = function () {
        return this.sanitizer.bypassSecurityTrustStyle('transform: matrix3d(1, 0, 0.00, 0.000, 0.00, 1, 0.00,' + this.upTilt / 100000 + ', 0, 0, 1, 0, 0, 0, 0, 1);');
    };
    QrCodeProcessComponent.prototype.rightPerspective = function () {
        return this.sanitizer.bypassSecurityTrustStyle('transform: matrix3d(1, 0, 0.00,' + this.rightTilt / 100000 + ', 0.00, 1, 0.00, 0.000, 0, 0, 1, 0, 0, 0, 0, 1);');
    };
    QrCodeProcessComponent.prototype.ngOnDestroy = function () {
        this.unsuscribeTimers();
    };
    QrCodeProcessComponent.prototype.unsuscribeTimers = function () {
        this.qrCodeSubscription.unsubscribe();
        this.attendanceNoSubscription.unsubscribe();
    };
    return QrCodeProcessComponent;
}());
__decorate([
    core_1.HostListener('window:beforeunload', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QrCodeProcessComponent.prototype, "beforeunloadHandler", null);
QrCodeProcessComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'qrcode-process',
        templateUrl: './qrcode-process.component.html',
        styleUrls: ['./qrcode-process.component.css'],
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        common_1.PlatformLocation,
        login_service_1.LoginService,
        teacher_service_1.TeacherService,
        messages_service_1.MessagesService,
        error_handler_service_1.ErrorHandlerService,
        platform_browser_1.DomSanitizer])
], QrCodeProcessComponent);
exports.QrCodeProcessComponent = QrCodeProcessComponent;
//# sourceMappingURL=qrcode-process.component.js.map