import { Component, OnInit, HostListener } from '@angular/core';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { TeacherGroup } from './../shared/model/teacher-group/teacher-group';
import { TeacherGroupKey } from './../../shared/types/key/teacher-group-key';

import { info, error, warn } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de asignaciones de docentes a grupos del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'teacher-group',
    templateUrl: './teacher-group.component.html',
    styleUrls: ['./teacher-group.component.css'],
})
export class TeacherGroupComponent implements OnInit {
    private static readonly teacherGroup = 'teacherGroup';
    private static readonly fileName = 'teacherGroups';

    private url: string;

    private teacherGroups: TeacherGroup[];
    private selectedTeacherGroup: TeacherGroup;
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
        this.getTeacherGroups();
    }

    get fileName() {
        return TeacherGroupComponent.fileName;
    }

    getUrl() {
        this.url = this.adminService.getAdminUrl(TeacherGroupComponent.teacherGroup);
    }

    getTeacherGroups() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherGroups = [];
            this.adminService
                .getTeacherGroups()
                .then((teacherGroups) => {
                    this.teacherGroups = teacherGroups;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteTeacherGroup() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            let teacherGroupKey: TeacherGroupKey = new TeacherGroupKey();
            teacherGroupKey.teacher = this.selectedTeacherGroup.teacher.id;
            teacherGroupKey.group = this.selectedTeacherGroup.group.id;

            this.adminService
                .deleteTeacherGroup(teacherGroupKey)
                .then(() => {
                    let index = this.teacherGroups.indexOf(this.selectedTeacherGroup, 0);
                    if (index > -1) {
                        this.selectedTeacherGroup = null;
                        this.teacherGroups.splice(index, 1);
                        this.messagesService.showMessage(
                            info,
                            '¡La asignación del docente al grupo seleccionado ha sido eliminada correctamente!'
                        );
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateTeacherGroup() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    createTeacherGroup() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    deleteOrUpdateTeacherGroupButtonState() {
        return this.selectedTeacherGroup === undefined || this.selectedTeacherGroup === null ? true : false;
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
                this.messagesService.showMessage(info, '¡Las asignaciones de los docentes a los grupos han sido importadas correctamente!');
                this.getTeacherGroups();
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
