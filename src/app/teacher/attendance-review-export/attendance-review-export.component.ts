import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { SelectItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { TeacherService } from './../shared/service/teacher.service';
import { i18nService } from './../../shared/i18n/service/i18n.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { User } from './../../shared/model/user/user';
import { Session } from './../../shared/model/session/session';
import { AttendanceOptions } from './../shared/model/attendance-options/attendance-options';
import { Attendance } from './../shared/model/attendance/attendance';
import { AttendanceDto } from './../shared/model/attendance-dto/attendance-dto';

import { info, error, warn } from './../../shared/types/severity-message';
import { xlsx } from './../../shared/types/export-format';

/**
 * Componente para la pantalla de exportación y revisión de asistencias del docente.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'attendance-review-export',
    templateUrl: './attendance-review-export.component.html',
    styleUrls: ['./attendance-review-export.component.css'],
})
export class AttendanceReviewExportComponent implements OnInit {
    private static readonly attendance = 'attendance';
    private static readonly fileName = 'attendances';

    private url: string;

    private user: User;
    private sessions: Session[];
    private attendances: Attendance[];
    private modifiedAttendances: Attendance[];
    private exportOptions: AttendanceOptions;
    private displayFormat: boolean;

    private formatsSI: SelectItem[];
    private subjectsSI: SelectItem[];
    private groupsSI: SelectItem[];
    private sessionsSI: SelectItem[];
    private selectedFormat: string;
    private selectedSubject: number;
    private selectedGroup: number;
    private selectedSession: number;

    private datePipe: DatePipe;

    constructor(
        private router: Router,
        private loginService: LoginService,
        private teacherService: TeacherService,
        private i18nService: i18nService,
        private errorHandlerService: ErrorHandlerService,
        private messagesService: MessagesService
    ) {
        this.displayFormat = false;
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
        this.loginService.logOut();
    }

    ngOnInit(): void {
        this.datePipe = new DatePipe(this.i18nService.getLocale() as string);
        this.user = this.loginService.getLoggedUser();
        this.getUrl();
        this.getFormats();
        this.getSubjects();
    }

    get fileName() {
        return AttendanceReviewExportComponent.fileName;
    }

    getUrl() {
        this.url = this.teacherService.getTeacherUrl(AttendanceReviewExportComponent.attendance);
    }

    getFormats() {
        this.formatsSI = [];
        this.formatsSI.push({ label: 'Excel', value: xlsx });
    }

    getSubjects() {
        this.subjectsSI = [];
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .getSubjects(this.user.id)
                .then((subjects) => {
                    for (let i = 0; i < subjects.length; i++) {
                        this.subjectsSI.push({ label: subjects[i].denomination, value: subjects[i].id });
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    getGroups() {
        this.groupsSI = [];
        this.sessionsSI = [];
        this.selectedGroup = null;
        this.selectedSession = null;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .getGroups(this.user.id, this.selectedSubject)
                .then((groups) => {
                    this.groupsSI.push({ label: 'Todos', value: -1 });
                    for (let i = 0; i < groups.length; i++) {
                        this.groupsSI.push({ label: groups[i].code, value: groups[i].id });
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    getSessions() {
        this.sessionsSI = [];
        this.selectedSession = null;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .getSessions(this.user.id, this.selectedSubject, this.selectedGroup)
                .then((sessions) => {
                    this.sessions = sessions;
                    this.sessionsSI = [];
                    this.sessionsSI.push({ label: 'Todas', value: -1 });
                    for (let i = 0; i < this.sessions.length; i++) {
                        let startDate: Date = new Date(this.sessions[i].start);
                        this.sessionsSI.push({
                            label: this.datePipe.transform(startDate, 'dd/MM/yyyy HH:mm') + ' / ' + this.sessions[i].location,
                            value: this.sessions[i].id,
                        });
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    getAttendances() {
        this.exportOptions = new AttendanceOptions();
        this.exportOptions.teacherId = this.user.id;
        this.exportOptions.subjectId = this.selectedSubject;
        this.exportOptions.groupId = this.selectedGroup;
        this.exportOptions.sessionId = this.selectedSession;

        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .getAttendances(this.exportOptions)
                .then((attendances) => {
                    this.attendances = [];
                    this.modifiedAttendances = [];
                    this.attendances = attendances;
                    this.getStudentNaturalGroups();
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    modifyAttendance(attendance: Attendance) {
        let index = this.modifiedAttendances.indexOf(attendance);

        if (index === -1 && attendance.comment.length === 0) {
            this.messagesService.showMessage(
                warn,
                `¡Introduzca un comentario que indique las razones 
        del cambio realizado sobre la asistencia del alumno!`
            );
        } else if (index !== -1) {
            this.modifiedAttendances.splice(index);
        } else {
            this.modifiedAttendances.push(attendance);
        }
    }

    updateAttendances() {
        let observables: any[] = [];
        this.modifiedAttendances.forEach((attendance) => {
            let attendanceDto = new AttendanceDto();
            attendanceDto.comment = attendance.comment;
            attendanceDto.confirmed = attendance.confirmed;
            attendanceDto.student = attendance.student.id;
            attendanceDto.session = attendance.session.id;
            observables.push(this.teacherService.updateAttendance(attendanceDto));
        });

        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            Observable.forkJoin(observables).subscribe((result) => {
                this.messagesService.showMessage(info, '¡Los datos de las asistencias han sido modificadas correctamente!');
                this.getAttendances();
            });
        }
    }

    exportAttendances() {
        this.exportOptions = new AttendanceOptions();
        this.exportOptions.format = this.selectedFormat;
        this.exportOptions.teacherId = this.user.id;
        this.exportOptions.subjectId = this.selectedSubject;
        this.exportOptions.groupId = this.selectedGroup;
        this.exportOptions.sessionId = this.selectedSession;
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .exportAttendances(this.exportOptions)
                .then((exportFile) => {
                    if (exportFile && exportFile.size !== 0) {
                        FileSaver.saveAs(exportFile, exportFile.name);
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    showFormatDialog() {
        this.displayFormat = true;
    }

    hideFormatDialog() {
        this.displayFormat = false;
    }

    onBeforeSend(event: any) {
        this.teacherService.setImportRequestHeaders(event.xhr as XMLHttpRequest);
    }

    onUpload(event: any) {
        let file = this.teacherService.processImportResponse(event.xhr as XMLHttpRequest);

        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(info, '¡Las asistencias del fichero han sido importados correctamente!');
                if (!this.exportAttendancesButtonState()) {
                    this.getAttendances();
                }
            } else {
                this.messagesService.showMessage(
                    error,
                    `¡El fichero importado contiene inconsistencias! 
        ¡Por favor, corrija los errores indicados en el fichero adjunto e importe de nuevo el fichero corregido!`
                );
                FileSaver.saveAs(file, file.name);
            }
        }
    }

    exportAttendancesButtonState() {
        return this.selectedFormat === undefined || this.selectedSession === undefined || this.selectedSession === null ? true : false;
    }

    getAttendancesButtonState() {
        return this.selectedSession === undefined || this.selectedSession === null ? true : false;
    }

    updateAttendancesButtonState() {
        return this.modifiedAttendances === undefined || this.modifiedAttendances.length === 0 ? true : false;
    }

    private getStudentNaturalGroups() {
        this.attendances.forEach((attendance) => {
            this.teacherService
                .getStudentNaturalGroup(
                    attendance.student.id,
                    attendance.session.group.type,
                    attendance.session.group.subject.course.id,
                    attendance.session.group.subject.subject.id
                )
                .then((studentGroup) => {
                    attendance.student.studentGroup = studentGroup;
                });
        });
    }
}
