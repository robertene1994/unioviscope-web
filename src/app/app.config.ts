import { environment } from '../environments/environment';

export const apiUrl = environment.apiUrl;
export const apiUrlCommon = apiUrl + '/common';
export const apiUrlAdmin = apiUrl + '/admin';
export const apiUrlTeacher = apiUrl + '/teacher';
export const apiUrlSyllabus = apiUrl + '/syllabus';
export const apiUrlSubject = apiUrl + '/subject';
export const apiUrlCourse = apiUrl + '/course';
export const apiUrlCourseSubject = apiUrl + '/courseSubject';
export const apiUrlGroup = apiUrl + '/group';
export const apiUrlTeachers = apiUrl + '/teachers';
export const apiUrlStudents = apiUrl + '/students';
export const apiUrlSession = apiUrl + '/session';
export const apiUrlTeacherGroup = apiUrl + '/teacherGroup';
export const apiUrlStudentGroup = apiUrl + '/studentGroup';
export const apiUrlAttendance = apiUrl + '/attendance';

export const serviceTimeOutMillis = 5000;
export const defaultLocale = 'es-ES';

export const maxErrorsShown = 7;
export const showErrorTimeIntervalSeconds = 5;

export const qrCodeRequestIntervalSeconds = 5;
export const attendancesNoRequestIntervalSeconds = 3;
