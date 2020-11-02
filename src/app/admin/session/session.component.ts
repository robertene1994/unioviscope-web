import { Component, OnInit, HostListener } from '@angular/core';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { Session } from './../../shared/model/session/session';

import { info, error, warn } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de sesiones del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'session',
    templateUrl: './session.component.html',
    styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit {
    private static readonly session = 'session';
    private static readonly fileName = 'sessions';
    private static readonly dateFormat = 'dd/MM/yyyy HH:mm';

    private url: string;

    private sessions: Session[];
    private selectedSession: Session;
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
        this.getSessions();
    }

    get fileName() {
        return SessionComponent.fileName;
    }

    get dateFormat() {
        return SessionComponent.dateFormat;
    }

    getUrl() {
        this.url = this.adminService.getAdminUrl(SessionComponent.session);
    }

    getSessions() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.sessions = [];
            this.adminService
                .getSessions()
                .then((sessions) => {
                    this.sessions = sessions;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteSession() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteSession(this.selectedSession.id)
                .then(() => {
                    let index = this.sessions.indexOf(this.selectedSession, 0);
                    if (index > -1) {
                        this.selectedSession = null;
                        this.sessions.splice(index, 1);
                        this.messagesService.showMessage(info, '¡La sesión seleccionada ha sido eliminada correctamente!');
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateSession() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    createSession() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    deleteOrUpdateSessionButtonState() {
        return this.selectedSession === undefined || this.selectedSession === null ? true : false;
    }

    onBeforeSend(event: any) {
        this.adminService.setImportRequestHeaders(event.xhr as XMLHttpRequest);
    }

    showFormatDialog() {
        this.displayFormat = true;
    }

    hideFormatDialog() {
        this.displayFormat = false;
    }

    onUpload(event: any) {
        let file = this.adminService.processImportResponse(event.xhr as XMLHttpRequest);

        if (file) {
            if (file.size === 0) {
                this.messagesService.showMessage(info, '¡Las sesiones del fichero han sido importadas correctamente!');
                this.getSessions();
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
