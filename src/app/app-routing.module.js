"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var login_component_1 = require("./shared/login/login.component");
var attendance_review_export_component_1 = require("./teacher/attendance-review-export/attendance-review-export.component");
var attendance_process_component_1 = require("./teacher/attendance-process/attendance-process.component");
var session_details_component_1 = require("./teacher/attendance-process/session-details/session-details.component");
var qrcode_process_component_1 = require("./teacher/attendance-process/qrcode-process/qrcode-process.component");
var syllabus_component_1 = require("./admin/syllabus/syllabus.component");
var subject_component_1 = require("./admin/subject/subject.component");
var course_component_1 = require("./admin/course/course.component");
var group_component_1 = require("./admin/group/group.component");
var teachers_component_1 = require("./admin/teachers/teachers.component");
var students_component_1 = require("./admin/students/students.component");
var session_component_1 = require("./admin/session/session.component");
var teacher_group_component_1 = require("./admin/teacher-group/teacher-group.component");
var student_group_component_1 = require("./admin/student-group/student-group.component");
var auth_guard_service_1 = require("./shared/service/auth-guard/auth-guard.service");
var role_1 = require("./shared/types/role");
var routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'teacher', redirectTo: '/attendanceProcess', canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.teacher } },
    { path: 'attendanceProcess', component: attendance_process_component_1.AttendanceProcessComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.teacher } },
    { path: 'sessionDetails/:session', component: session_details_component_1.SessionDetailsComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.teacher } },
    { path: 'qrCodeProcess/:session', component: qrcode_process_component_1.QrCodeProcessComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.teacher } },
    { path: 'attendanceReviewExport', component: attendance_review_export_component_1.AttendanceReviewExportComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.teacher } },
    { path: 'admin', redirectTo: '/syllabus', canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'syllabus', component: syllabus_component_1.SyllabusComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'subject', component: subject_component_1.SubjectComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'course', component: course_component_1.CourseComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'group', component: group_component_1.GroupComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'teachers', component: teachers_component_1.TeachersComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'students', component: students_component_1.StudentsComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'session', component: session_component_1.SessionComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'teacherGroup', component: teacher_group_component_1.TeacherGroupComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: 'studentGroup', component: student_group_component_1.StudentGroupComponent, canActivate: [auth_guard_service_1.AuthGuard], data: { role: role_1.admin } },
    { path: '**', redirectTo: '/login' },
];
/**
 * Módulo que define las rutas para las diferentes funcionalidades ofrecidas.
 *
 * @author Robert Ene
 */
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule],
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map