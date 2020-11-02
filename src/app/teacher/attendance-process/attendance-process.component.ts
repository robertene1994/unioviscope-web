import { Component, OnInit, HostListener } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { SelectItem } from 'primeng/primeng';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { MessagesService } from './../../shared/service/messages/messages.service';
import { LoginService } from './../../shared/login/service/login.service';
import { TeacherService } from './../shared/service/teacher.service';
import { i18nService } from './../../shared/i18n/service/i18n.service';

import { Session } from './../../shared/model/session/session';
import { User } from './../../shared/model/user/user';

import { info } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de configuración y apertura del control de presencia del docente.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'attendance-process',
    templateUrl: './attendance-process.component.html',
    styleUrls: ['./attendance-process.component.css'],
})
export class AttendanceProcessComponent implements OnInit {
    private user: User;
    private sessions: Session[];
    private isOngoingSesions: boolean;

    private subjectsSI: SelectItem[];
    private groupsSI: SelectItem[];
    private sessionsSI: SelectItem[];
    private selectedSubject: number;
    private selectedGroup: number;
    private selectedSession: number;

    private datePipe: DatePipe;

    constructor(
        private location: Location,
        private router: Router,
        private loginService: LoginService,
        private i18nService: i18nService,
        private teacherService: TeacherService,
        private messagesService: MessagesService,
        private errorHandlerService: ErrorHandlerService
    ) {}

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
        this.loginService.logOut();
    }

    ngOnInit() {
        this.isOngoingSesions = false;
        this.datePipe = new DatePipe(this.i18nService.getLocale() as string);
        this.user = this.loginService.getLoggedUser();
        this.getSubjects();
    }

    getSubjects() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.subjectsSI = [];
            this.teacherService
                .getSubjects(this.user.id)
                .then((subjects) => {
                    if (subjects.length === 0) {
                        this.messagesService.showMessage(info, '¡No tiene asignaturas asignadas para curso académico actual!');
                    } else {
                        for (let i = 0; i < subjects.length; i++) {
                            this.subjectsSI.push({ label: subjects[i].denomination, value: subjects[i].id });
                        }
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    getGroups() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.groupsSI = [];
            this.sessionsSI = [];
            this.selectedGroup = null;
            this.selectedSession = null;
            this.teacherService
                .getGroups(this.user.id, this.selectedSubject)
                .then((groups) => {
                    if (groups.length === 0) {
                        this.messagesService.showMessage(info, '¡No tiene grupos asignados para la asignaturas seleccionada!');
                    } else {
                        for (let i = 0; i < groups.length; i++) {
                            this.groupsSI.push({ label: groups[i].code, value: groups[i].id });
                        }
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    getSessions() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.sessionsSI = [];
            this.selectedSession = null;
            this.teacherService
                .getSessions(this.user.id, this.selectedSubject, this.selectedGroup)
                .then((sessions) => {
                    this.sessions = sessions;
                    if (this.sessions.length === 0) {
                        this.messagesService.showMessage(info, '¡No hay sesiones planificadas para el grupo seleccionado!');
                    } else {
                        this.showSessionsForSwitch();
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    ongoingSessionsSwitchState() {
        return this.selectedSubject === undefined ||
            this.selectedSubject === null ||
            this.selectedGroup === undefined ||
            this.selectedGroup === null
            ? true
            : false;
    }

    goForward() {
        this.router.navigate(['/sessionDetails', btoa(JSON.stringify(this.sessions[this.selectedSession]))]);
    }

    forwardButtonState() {
        return this.selectedSession === undefined || this.selectedSession === null ? true : false;
    }

    showSessionsForSwitch() {
        this.sessionsSI = [];
        this.selectedSession = undefined;
        for (let i = 0; i < this.sessions.length; i++) {
            if (this.isOngoingSesions) {
                let currentDate = new Date().getTime();
                if (this.sessions[i].start <= currentDate && currentDate <= this.sessions[i].end) {
                    this.pushSession(i, this.sessions[i]);
                }
            } else {
                this.pushSession(i, this.sessions[i]);
            }
        }
    }

    private pushSession(index: number, session: Session) {
        let startDate: Date = new Date(this.sessions[index].start);
        this.sessionsSI.push({
            label: this.datePipe.transform(startDate, 'dd/MM/yyyy HH:mm') + ' / ' + this.sessions[index].location,
            value: index,
        });
    }
}
