import { Component, OnInit, HostListener } from '@angular/core';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { StudentGroup } from './../shared/model/student-group/student-group';
import { StudentGroupKey } from './../../shared/types/key/student-group-key';

import { info, error, warn } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de asignaciones de estudiantes a grupos del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'student-group',
    templateUrl: './student-group.component.html',
    styleUrls: ['./student-group.component.css'],
})
export class StudentGroupComponent implements OnInit {
    private static readonly studentGroup = 'studentGroup';
    private static readonly fileName = 'studentGroups';

    private url: string;

    private studentGroups: StudentGroup[];
    private selectedStudentGroup: StudentGroup;
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
        this.getStudentGroups();
    }

    get fileName() {
        return StudentGroupComponent.fileName;
    }

    getUrl() {
        this.url = this.adminService.getAdminUrl(StudentGroupComponent.studentGroup);
    }

    getStudentGroups() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.studentGroups = [];
            this.adminService
                .getStudentGroups()
                .then((studentGroups) => {
                    this.studentGroups = studentGroups;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteStudentGroup() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            let studentGroupKey: StudentGroupKey = new StudentGroupKey();
            studentGroupKey.student = this.selectedStudentGroup.student.id;
            studentGroupKey.group = this.selectedStudentGroup.group.id;

            this.adminService
                .deleteStudentGroup(studentGroupKey)
                .then(() => {
                    let index = this.studentGroups.indexOf(this.selectedStudentGroup, 0);
                    if (index > -1) {
                        this.selectedStudentGroup = null;
                        this.studentGroups.splice(index, 1);
                        this.messagesService.showMessage(
                            info,
                            '¡La asignación del estudiante al grupo seleccionado ha sido eliminada correctamente!'
                        );
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateStudentGroup() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    createStudentGroup() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    deleteOrUpdateStudentGroupButtonState() {
        return this.selectedStudentGroup === undefined || this.selectedStudentGroup === null ? true : false;
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
                this.messagesService.showMessage(
                    info,
                    '¡Las asignaciones de los estudiantes a los grupos han sido importadas correctamente!'
                );
                this.getStudentGroups();
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
