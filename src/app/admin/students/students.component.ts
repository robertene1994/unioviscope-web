import { Component, OnInit, HostListener } from '@angular/core';

import * as FileSaver from 'file-saver';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { Student } from './../shared/model/student/student';

import { info, error, warn } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de estudiantes del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'students',
    templateUrl: './students.component.html',
    styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
    private static readonly student = 'student';
    private static readonly fileName = 'students';

    private url: string;

    private students: Student[];
    private selectedStudent: Student;
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
        this.getStudents();
    }

    get fileName() {
        return StudentsComponent.fileName;
    }

    getUrl() {
        this.url = this.adminService.getAdminUrl(StudentsComponent.student);
    }

    getStudents() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.students = [];
            this.adminService
                .getStudents()
                .then((students) => {
                    this.students = students;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteStudent() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .deleteStudent(this.selectedStudent.id)
                .then(() => {
                    let index = this.students.indexOf(this.selectedStudent, 0);
                    if (index > -1) {
                        this.selectedStudent = null;
                        this.students.splice(index, 1);
                        this.messagesService.showMessage(info, '¡El estudiante seleccionado ha sido eliminado correctamente!');
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateStudent() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    createStudent() {
        this.messagesService.showMessage(warn, '¡Funcionalidad no implementada!');
    }

    deleteOrUpdateStudentButtonState() {
        return this.selectedStudent === undefined || this.selectedStudent === null ? true : false;
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
                this.messagesService.showMessage(info, '¡Los estudiantes del fichero han sido importados correctamente!');
                this.getStudents();
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
