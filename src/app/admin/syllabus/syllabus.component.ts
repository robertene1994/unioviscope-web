import { Component, OnInit, HostListener } from '@angular/core';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { Syllabus } from './../shared/model/syllabus/syllabus';

import { info, error, warn } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de planes de estudios del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'syllabus',
    templateUrl: './syllabus.component.html',
    styleUrls: ['./syllabus.component.css'],
})
export class SyllabusComponent implements OnInit {
    private static readonly syllabus = 'syllabus';
    private static readonly fileName = 'syllabuses';

    private url: string;

    private syllabuses: Syllabus[];
    private selectedSyllabus: Syllabus;
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
        this.getSyllabuses();
    }

    get fileName() {
        return SyllabusComponent.fileName;
    }

    getUrl() {
        this.url = this.adminService.getAdminUrl(SyllabusComponent.syllabus);
    }

    getSyllabuses() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.syllabuses = [];
            this.adminService
                .getSyllabuses()
                .then((syllabuses) => {
                    this.syllabuses = syllabuses;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteSyllabus() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteSyllabus(this.selectedSyllabus.id)
                .then(() => {
                    let index = this.syllabuses.indexOf(this.selectedSyllabus, 0);
                    if (index > -1) {
                        this.selectedSyllabus = null;
                        this.syllabuses.splice(index, 1);
                        this.messagesService.showMessage(info, '¡El plan de estudios seleccionado ha sido eliminado correctamente!');
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateSyllabus() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    createSyllabus() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    deleteOrUpdateSyllabusButtonState() {
        return this.selectedSyllabus === undefined || this.selectedSyllabus === null ? true : false;
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
                this.messagesService.showMessage(info, '¡Los planes de estudios del fichero han sido importados correctamente!');
                this.getSyllabuses();
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
