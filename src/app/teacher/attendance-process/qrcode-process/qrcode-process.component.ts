import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Observable, Subscription } from 'rxjs/Rx';

import { ErrorHandlerService } from './../../../shared/error-handler/error-handler.service';
import { LoginService } from './../../../shared/login/service/login.service';
import { TeacherService } from './../../shared/service/teacher.service';
import { MessagesService } from './../../../shared/service/messages/messages.service';

import { Session } from './../../../shared/model/session/session';

import { qrCodeRequestIntervalSeconds, attendancesNoRequestIntervalSeconds } from './../../../app.config';

/**
 * Componente para la pantalla del proceso de confirmación de asistencias del docente.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'qrcode-process',
    templateUrl: './qrcode-process.component.html',
    styleUrls: ['./qrcode-process.component.css'],
})
export class QrCodeProcessComponent implements OnInit, OnDestroy {
    private session: Session;
    private attendancesNo: number;
    private qrCode: SafeResourceUrl;
    private isQrPerspective: boolean;

    private qrCodeTimer: Observable<number>;
    private qrCodeSubscription: Subscription;

    private attendanceNoTimer: Observable<number>;
    private attendanceNoSubscription: Subscription;

    private centerSize: number;
    private leftTilt: number;
    private upTilt: number;
    private rightTilt: number;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: PlatformLocation,
        private loginService: LoginService,
        private teacherService: TeacherService,
        private messagesService: MessagesService,
        private errorHandlerService: ErrorHandlerService,
        private sanitizer: DomSanitizer
    ) {
        this.loginService.setQrCodeProcess(this);
        this.location.onPopState(() => {
            if (this.location.pathname.startsWith('/sessionDetails')) {
                this.stopQrCodeProcess();
            }
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
        this.loginService.logOut();
    }

    ngOnInit() {
        this.getSession();
        this.isQrPerspective = false;
        this.centerSize = 80;
        this.leftTilt = 80;
        this.upTilt = 70;
        this.rightTilt = 80;

        this.qrCodeTimer = Observable.timer(0, qrCodeRequestIntervalSeconds * 1000);
        this.attendanceNoTimer = Observable.timer(0, attendancesNoRequestIntervalSeconds * 1000);
        this.startQrCodeProcess();
    }

    getSession() {
        this.route.params.subscribe((params) => {
            if (params['session']) {
                let session = JSON.parse(atob(params['session'])) as Session;
                this.session = session;
            }
        });
    }

    startQrCodeProcess() {
        this.qrCodeSubscription = this.qrCodeTimer.subscribe(() => {
            if (this.errorHandlerService.handleNoInternetConnectionError()) {
                this.teacherService
                    .getQrCode(this.session.id)
                    .then((qrCode) => {
                        this.qrCode = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(qrCode));
                    })
                    .catch((error) => this.errorHandlerService.handleError(error));
            }
        });

        this.attendanceNoSubscription = this.attendanceNoTimer.subscribe(() => {
            if (this.errorHandlerService.handleNoInternetConnectionError()) {
                this.teacherService
                    .getAttendancesNo(this.session.id)
                    .then((attendancesNo) => {
                        this.attendancesNo = attendancesNo;
                    })
                    .catch((error) => this.errorHandlerService.handleError(error));
            }
        });
    }

    stopQrCodeProcess() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .stopQrCodeProcess(this.session.id)
                .then((stopped) => {
                    this.unsuscribeTimers();
                    this.router.navigate(['attendanceProcess']);
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    stopQrCodeProcessFromOutside(): Promise<void> {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            return this.teacherService
                .stopQrCodeProcess(this.session.id)
                .then((stopped) => {
                    this.unsuscribeTimers();
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    centerPerspective() {
        if (!this.isQrPerspective) {
            return this.sanitizer.bypassSecurityTrustStyle('height:' + this.centerSize + 'vh');
        }
        return this.sanitizer.bypassSecurityTrustStyle('height:' + this.centerSize / 2 + 'vh');
    }

    leftPerspective() {
        return this.sanitizer.bypassSecurityTrustStyle(
            'transform: matrix3d(1, 0, 0.00,-' + this.leftTilt / 100000 + ', 0.00, 1, 0.00, 0.000, 0, 0, 1, 0, 0, 0, 0, 1);'
        );
    }

    upPerspective() {
        return this.sanitizer.bypassSecurityTrustStyle(
            'transform: matrix3d(1, 0, 0.00, 0.000, 0.00, 1, 0.00,' + this.upTilt / 100000 + ', 0, 0, 1, 0, 0, 0, 0, 1);'
        );
    }

    rightPerspective() {
        return this.sanitizer.bypassSecurityTrustStyle(
            'transform: matrix3d(1, 0, 0.00,' + this.rightTilt / 100000 + ', 0.00, 1, 0.00, 0.000, 0, 0, 1, 0, 0, 0, 0, 1);'
        );
    }

    ngOnDestroy() {
        this.unsuscribeTimers();
    }

    private unsuscribeTimers() {
        this.qrCodeSubscription.unsubscribe();
        this.attendanceNoSubscription.unsubscribe();
    }
}
