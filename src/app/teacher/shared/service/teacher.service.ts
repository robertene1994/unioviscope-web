import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';

import { HttpService } from './../../../shared/service/http/http.service';
import { ErrorHandlerService } from './../../../shared/error-handler/error-handler.service';

import { Subject } from './../../../shared/model/subject/subject';
import { Group } from './../../../shared/model/group/group';
import { Session } from './../../../shared/model/session/session';
import { AttendanceOptions } from './../model/attendance-options/attendance-options';
import { Attendance } from './../model/attendance/attendance';
import { StudentGroup } from './../../../admin/shared/model/student-group/student-group';
import { AttendanceDto } from './../model/attendance-dto/attendance-dto';

import { apiUrlTeacher, apiUrlSession, apiUrlAttendance, apiUrlStudentGroup } from './../../../app.config';

/**
 * Servicios para las funcionalidades ofrecidas para el docente.
 *
 * @author Robert Ene
 */
@Injectable()
export class TeacherService {
    constructor(private http: HttpService, private errorHandlerService: ErrorHandlerService) {}

    getSubjects(teacherId: number): Promise<Subject[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('teacherId', teacherId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.getAuth(apiUrlTeacher + '/findLastYearSubjects', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Subject[];
        });
    }

    getGroups(teacherId: number, subjectId: number): Promise<Group[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('teacherId', teacherId.toString());
        params.set('subjectId', subjectId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.getAuth(apiUrlTeacher + '/findLastYearSubjectGroups', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Group[];
        });
    }

    getSessions(teacherId: number, subjectId: number, groupId: number): Promise<Session[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('teacherId', teacherId.toString());
        params.set('subjectId', subjectId.toString());
        params.set('groupId', groupId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.getAuth(apiUrlTeacher + '/findLastYearSubjectGroupSessions', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Session[];
        });
    }

    getSessionLocations(subjectId: number): Promise<string[]> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('subjectId', subjectId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.getAuth(apiUrlTeacher + '/findLocationsBySubject', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as string[];
        });
    }

    getQrCode(sessionId: number): Promise<Blob> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('sessionId', sessionId.toString());
        let options = new RequestOptions();
        options.search = params;
        options.responseType = ResponseContentType.Blob;

        return this.http.getAuth(apiUrlTeacher + '/createQrCodeForSession', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return new Blob([response.blob()], { type: 'image/png' });
        });
    }

    stopQrCodeProcess(sessionId: number): Promise<boolean> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('sessionId', sessionId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.getAuth(apiUrlTeacher + '/stopQrCodeProcessForSession', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as boolean;
        });
    }

    getAttendancesNo(sessionId: number): Promise<number> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('sessionId', sessionId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.getAuth(apiUrlTeacher + '/findAttendancesNoBySession', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as number;
        });
    }

    saveSession(session: Session): Promise<Session> {
        return this.http.postAuth(apiUrlSession + '/save', JSON.stringify(session)).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Session;
        });
    }

    updateSession(session: Session): Promise<Session> {
        return this.http.putAuth(apiUrlSession + '/update', JSON.stringify(session)).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Session;
        });
    }

    exportAttendances(attendanceOptions: AttendanceOptions): Promise<File> {
        let options = new RequestOptions();
        options.responseType = ResponseContentType.Blob;

        return this.http.postAuth(apiUrlTeacher + '/exportAttendances', JSON.stringify(attendanceOptions), options).then((response) => {
            if (this.errorHandlerService.handleExportExceptionResponse(response)) {
                return new File([response.blob()], response.headers.get('X-Filename'));
            }
            return new File([], response.headers.get('X-Filename'));
        });
    }

    getAttendances(attendanceOptions: AttendanceOptions): Promise<Attendance[]> {
        return this.http.postAuth(apiUrlTeacher + '/findAttendances', JSON.stringify(attendanceOptions)).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Attendance[];
        });
    }

    getStudentNaturalGroup(studentId: number, groupType: string, courseId: number, subjectId: number): Promise<StudentGroup> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('studentId', studentId.toString());
        params.set('groupType', groupType);
        params.set('courseId', courseId.toString());
        params.set('subjectId', subjectId.toString());
        let options = new RequestOptions();
        options.search = params;

        return this.http.getAuth(apiUrlStudentGroup + '/findByStudentAndGroupTypeAndCourseAndSubject', options).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            if (response.text()) {
                return response.json() as StudentGroup;
            }
            return null;
        });
    }

    updateAttendance(attendance: AttendanceDto): Promise<Attendance> {
        return this.http.putAuth(apiUrlTeacher + '/updateAttendance', JSON.stringify(attendance)).then((response) => {
            this.errorHandlerService.handleExceptionResponse(response);
            return response.json() as Attendance;
        });
    }

    getTeacherUrl(type: string): string {
        let url;

        if (type === 'attendance') {
            url = apiUrlAttendance;
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
