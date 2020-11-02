import { Component, OnInit, HostListener } from '@angular/core';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { Subject } from './../../shared/model/subject/subject';

import { info, error, warn } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de asignaturas del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'subject',
    templateUrl: './subject.component.html',
    styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit {
    private static readonly subject = 'subject';
    private static readonly fileName = 'subjects';

    private url: string;

    private subjects: Subject[];
    private selectedSubject: Subject;
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
        this.getSubjects();
    }

    get fileName() {
        return SubjectComponent.fileName;
    }

    getUrl() {
        this.url = this.adminService.getAdminUrl(SubjectComponent.subject);
    }

    getSubjects() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.subjects = [];
            this.adminService
                .getSubjects()
                .then((subjects) => {
                    this.subjects = subjects;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteSubject() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteSubject(this.selectedSubject.id)
                .then(() => {
                    let index = this.subjects.indexOf(this.selectedSubject, 0);
                    if (index > -1) {
                        this.selectedSubject = null;
                        this.subjects.splice(index, 1);
                        this.messagesService.showMessage(info, '¡La asignatura seleccionada ha sido eliminada correctamente!');
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateSubject() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    createSubject() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    deleteOrUpdateSubjectButtonState() {
        return this.selectedSubject === undefined || this.selectedSubject === null ? true : false;
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
                this.messagesService.showMessage(info, '¡Las asignaturas del fichero han sido importadas correctamente!');
                this.getSubjects();
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
