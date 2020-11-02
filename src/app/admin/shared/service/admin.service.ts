import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';

import { ErrorHandlerService } from './../../../shared/error-handler/error-handler.service';
import { HttpService } from './../../../shared/service/http/http.service';

import { Syllabus } from './../model/syllabus/syllabus';
import { Course } from './../model/course/course';
import { CourseSubject } from './../../../shared/model/course-subject/course-subject';
import { Subject } from './../../../shared/model/subject/subject';
import { Group } from './../../../shared/model/group/group';
import { Session } from './../../../shared/model/session/session';
import { Student } from './../model/student/student';
import { Teacher } from './../model/teacher/teacher';
import { TeacherGroupKey } from './../../../shared/types/key/teacher-group-key';
import { TeacherGroup } from './../model/teacher-group/teacher-group';
import { StudentGroupKey } from './../../../shared/types/key/student-group-key';
import { StudentGroup } from './../model/student-group/student-group';

import {
    apiUrlSyllabus,
    apiUrlCourse,
    apiUrlCourseSubject,
    apiUrlSubject,
    apiUrlGroup,
    apiUrlTeachers,
    apiUrlStudents,
    apiUrlSession,
    apiUrlTeacherGroup,
    apiUrlStudentGroup,
} from './../../../app.config';

/**
 * Servicios para las funcionalidades ofrecidas para el administrador.
 *
 * @author Robert Ene
 */
@Injectable()
export class AdminService {
    constructor(private http: HttpService, private errorHandlerService: ErrorHandlerService) {}

    getSyllabuses(): Promise<Syllabus[]> {
        return this.http.getAuth(apiUrlSyllabus + '/findAll').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Syllabus[];
        });
    }

    deleteSyllabus(syllabusId: number): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', syllabusId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlSyllabus + '/deleteById', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getCourses(): Promise<CourseSubject[]> {
        return this.http.getAuth(apiUrlCourseSubject + '/findAllWithSyllabus').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as CourseSubject[];
        });
    }

    getLastCourse(): Promise<Course> {
        return this.http.getAuth(apiUrlCourse + '/findLast').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Course;
        });
    }

    createNextCourse(): Promise<void> {
        let options = new RequestOptions();
        return this.http.postAuth(apiUrlCourseSubject + '/createNextForAll', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    deleteLastCourse(courseYear: number, syllabusId: number): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('year', courseYear.toString());
        params.set('syllabusId', syllabusId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlCourseSubject + '/deleteByYearAndSyllabus', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getSubjects(): Promise<Subject[]> {
        return this.http.getAuth(apiUrlSubject + '/findAll').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Subject[];
        });
    }

    deleteSubject(subjectId: number): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', subjectId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlSubject + '/deleteById', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getGroups(): Promise<Group[]> {
        return this.http.getAuth(apiUrlGroup + '/findAll').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Group[];
        });
    }

    deleteGroup(groupId: number): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', groupId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlGroup + '/deleteById', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getTeachers(): Promise<Teacher[]> {
        return this.http.getAuth(apiUrlTeachers + '/findAll').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Teacher[];
        });
    }

    deleteTeacher(teacherId: number): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', teacherId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlTeachers + '/deleteById', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getStudents(): Promise<Student[]> {
        return this.http.getAuth(apiUrlStudents + '/findAll').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Student[];
        });
    }

    deleteStudent(studentId: number): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', studentId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlStudents + '/deleteById', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getSessions(): Promise<Session[]> {
        return this.http.getAuth(apiUrlSession + '/findAll').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Session[];
        });
    }

    deleteSession(sessionId: number): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', sessionId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlSession + '/deleteById', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getTeacherGroups(): Promise<TeacherGroup[]> {
        return this.http.getAuth(apiUrlTeacherGroup + '/findAll').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as TeacherGroup[];
        });
    }

    deleteTeacherGroup(teacherGroupId: TeacherGroupKey): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', JSON.stringify(teacherGroupId));
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlTeacherGroup + '/deleteById', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getStudentGroups(): Promise<StudentGroup[]> {
        return this.http.getAuth(apiUrlStudentGroup + '/findAll').then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as StudentGroup[];
        });
    }

    deleteStudentGroup(studentGroupId: StudentGroupKey): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('id', JSON.stringify(studentGroupId));
        let options = new RequestOptions();
        options.search = params;

        return this.http.deleteAuth(apiUrlStudentGroup + '/deleteById', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
        });
    }

    getAdminUrl(type: string): string {
        let url;

        switch (type) {
            case 'syllabus':
                url = apiUrlSyllabus;
                break;
            case 'subject':
                url = apiUrlSubject;
                break;
            case 'group':
                url = apiUrlGroup;
                break;
            case 'teacher':
                url = apiUrlTeachers;
                break;
            case 'student':
                url = apiUrlStudents;
                break;
            case 'session':
                url = apiUrlSession;
                break;
            case 'teacherGroup':
                url = apiUrlTeacherGroup;
                break;
            case 'studentGroup':
                url = apiUrlStudentGroup;
                break;
            default:
                break;
        }

        return (url += '/import');
    }

    setImportRequestHeaders(request: XMLHttpRequest) {
        this.http.setImportRequestHeaders(request);
    }

    processImportResponse(request: XMLHttpRequest): File {
        if (this.errorHandlerService.handleImportExceptionResponse(request)) {
            return this.http.processImportResponse(request);
        }
    }
}
