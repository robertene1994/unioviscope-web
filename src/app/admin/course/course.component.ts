import { Component, OnInit, HostListener } from '@angular/core';

import { ConfirmationService } from 'primeng/primeng';

import { ErrorHandlerService } from './../../shared/error-handler/error-handler.service';
import { LoginService } from './../../shared/login/service/login.service';
import { AdminService } from './../shared/service/admin.service';
import { MessagesService } from './../../shared/service/messages/messages.service';

import { Course } from './../shared/model/course/course';
import { CourseSubject } from './../../shared/model/course-subject/course-subject';

import { info } from './../../shared/types/severity-message';

/**
 * Componente para la pantalla de mantenimiento de cursos del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit {
    private lastCourse: Course;
    private courses: CourseSubject[];

    private selectedCourse: CourseSubject;

    private minYear: number;
    private maxYear: number;

    constructor(
        private loginService: LoginService,
        private adminService: AdminService,
        private messagesService: MessagesService,
        private confirmationService: ConfirmationService,
        private errorHandlerService: ErrorHandlerService
    ) {}

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
        this.loginService.logOut();
    }

    ngOnInit() {
        this.minYear = 0;
        this.maxYear = 0;
        this.getLastCourse();
        this.getCourses();
    }

    getLastCourse() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.adminService
                .getLastCourse()
                .then((course) => {
                    this.lastCourse = course;
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    getCourses() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.courses = [];
            this.adminService
                .getCourses()
                .then((courses) => {
                    this.courses = courses;
                    this.getMinMaxYear();
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    deleteLastCourse() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            let courseYear = this.selectedCourse.course.year;
            let syllabusId = this.selectedCourse.subject.syllabus.id;
            this.adminService
                .deleteLastCourse(courseYear, syllabusId)
                .then(() => {
                    let index = this.courses.indexOf(this.selectedCourse, 0);
                    if (index > -1) {
                        this.selectedCourse = null;
                        this.courses.splice(index, 1);
                        this.messagesService.showMessage(info, '¡El curso académico ha sido eliminado correctamente!');
                    }

                    if (this.courses.length === 0) {
                        this.ngOnInit();
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    createNextCourse() {
        this.adminService.createNextCourse().then(() => {
            let startCourse = this.lastCourse.year + 1;
            let endCourse = startCourse + 1;
            this.messagesService.showMessage(
                info,
                '¡El curso académico ' + startCourse + ' - ' + endCourse + ' ha sido creado correctamente!'
            );

            this.selectedCourse = null;
            this.minYear = 0;
            this.maxYear = 0;
            this.getLastCourse();
            this.getCourses();
        });
    }

    showDialogCreateNextCourse() {
        let startCourse = this.lastCourse.year + 1;
        let endCourse = startCourse + 1;

        this.confirmationService.confirm({
            header: 'Confirmación nuevo curso académico',
            message:
                '¿Está seguro de que desea crear el curso académico ' +
                startCourse +
                ' - ' +
                endCourse +
                ' para todos los planes de estudios?',
            accept: () => {
                this.createNextCourse();
            },
        });
    }

    deleteCourseButtonState() {
        return this.selectedCourse === undefined || this.selectedCourse === null ? true : false;
    }

    private getMinMaxYear() {
        if (this.courses.length > 0) {
            this.minYear = this.courses[0].course.year;
            this.maxYear = this.courses[0].course.year;

            this.courses.forEach((course) => {
                this.minYear = course.course.year < this.minYear ? course.course.year : this.minYear;
                this.maxYear = course.course.year > this.maxYear ? course.course.year : this.maxYear;
            });
        }
    }
}
