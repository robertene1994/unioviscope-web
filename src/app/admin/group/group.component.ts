import { Component, OnInit, HostListener } from '@angular/core';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { Group } from './../../shared/model/group/group';

import { info, error, warn } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de grupos del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'group',
    templateUrl: './group.component.html',
    styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
    private static readonly group = 'group';
    private static readonly fileName = 'groups';

    private url: string;

    private groups: Group[];
    private selectedGroup: Group;
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
        this.getGroups();
    }

    get fileName() {
        return GroupComponent.fileName;
    }

    getUrl() {
        this.url = this.adminService.getAdminUrl(GroupComponent.group);
    }

    getGroups() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.groups = [];
            this.adminService
                .getGroups()
                .then((groups) => {
                    this.groups = groups;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteGroup() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteGroup(this.selectedGroup.id)
                .then(() => {
                    let index = this.groups.indexOf(this.selectedGroup, 0);
                    if (index > -1) {
                        this.selectedGroup = null;
                        this.groups.splice(index, 1);
                        this.messagesService.showMessage(info, 'El grupo seleccionado ha sido eliminado correctamente!');
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateGroup() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    createGroup() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    deleteOrUpdateGroupButtonState() {
        return this.selectedGroup === undefined || this.selectedGroup === null ? true : false;
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
                this.messagesService.showMessage(info, '¡Los grupos del fichero han sido importados correctamente!');
                this.getGroups();
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
