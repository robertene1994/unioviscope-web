import { Component, OnInit, HostListener } from '@angular/core';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { Teacher } from './../shared/model/teacher/teacher';

import { info, error, warn } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de docentes del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'teachers',
    templateUrl: './teachers.component.html',
    styleUrls: ['./teachers.component.css'],
})
export class TeachersComponent implements OnInit {
    private static readonly teacher = 'teacher';
    private static readonly fileName = 'teachers';

    private url: string;

    private teachers: Teacher[];
    private selectedTeacher: Teacher;
    private displayFormat: boolean;

    constructor(
        private loginService: LoginService,
        private adminService: AdminService,
        private messagesService: MessagesService,
        private errorHandlerService: ErrorHandlerService
    ) {
        this.displayFormat = false;
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
        this.loginService.logOut();
    }

    ngOnInit() {
        this.getUrl();
        this.getTeachers();
    }

    get fileName() {
        return TeachersComponent.fileName;
    }

    getUrl() {
        this.url = this.adminService.getAdminUrl(TeachersComponent.teacher);
    }

    getTeachers() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teachers = [];
            this.adminService
                .getTeachers()
                .then((teachers) => {
                    this.teachers = teachers;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteTeacher() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteTeacher(this.selectedTeacher.id)
                .then(() => {
                    let index = this.teachers.indexOf(this.selectedTeacher, 0);
                    if (index > -1) {
                        this.selectedTeacher = null;
                        this.teachers.splice(index, 1);
                        this.messagesService.showMessage(info, '¡El docente seleccionado ha sido eliminado correctamente!');
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateTeacher() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    createTeacher() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    deleteOrUpdateTeacherButtonState() {
        return this.selectedTeacher === undefined || this.selectedTeacher === null ? true : false;
    }

    showFormatDialog() {
        this.displayFormat = true;
    }

    hideFormatDialog() {
        this.displayFormat = false;
    }

    onBeforeSend(event: any) {
        this.adminService.setImportRequestHeaders(event.xhr as XMLHttpRequest);
    }

    onUpload(event: any) {
        let file = this.adminService.processImportResponse(event.xhr as XMLHttpRequest);

        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(info, '¡Los docentes del fichero han sido importados correctamente!');
                this.getTeachers();
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
}
