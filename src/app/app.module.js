"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var primeng_1 = require("primeng/primeng");
var url_serializer_1 = require("./shared/url-serializer/url-serializer");
var angular2_jwt_1 = require("angular2-jwt");
var auth_module_1 = require("./shared/service/auth/auth.module");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./shared/app.component");
var login_component_1 = require("./shared/login/login.component");
var teacher_component_1 = require("./teacher/teacher.component");
var attendance_process_component_1 = require("./teacher/attendance-process/attendance-process.component");
var session_details_component_1 = require("./teacher/attendance-process/session-details/session-details.component");
var qrcode_process_component_1 = require("./teacher/attendance-process/qrcode-process/qrcode-process.component");
var attendance_review_export_component_1 = require("./teacher/attendance-review-export/attendance-review-export.component");
var admin_component_1 = require("./admin/admin.component");
var syllabus_component_1 = require("./admin/syllabus/syllabus.component");
var course_component_1 = require("./admin/course/course.component");
var subject_component_1 = require("./admin/subject/subject.component");
var group_component_1 = require("./admin/group/group.component");
var teachers_component_1 = require("./admin/teachers/teachers.component");
var students_component_1 = require("./admin/students/students.component");
var session_component_1 = require("./admin/session/session.component");
var teacher_group_component_1 = require("./admin/teacher-group/teacher-group.component");
var student_group_component_1 = require("./admin/student-group/student-group.component");
var http_service_1 = require("./shared/service/http/http.service");
var error_handler_service_1 = require("./shared/error-handler/error-handler.service");
var messages_service_1 = require("./shared/service/messages/messages.service");
var auth_guard_service_1 = require("./shared/service/auth-guard/auth-guard.service");
var login_service_1 = require("./shared/login/service/login.service");
var teacher_service_1 = require("./teacher/shared/service/teacher.service");
var admin_service_1 = require("./admin/shared/service/admin.service");
var i18n_service_1 = require("./shared/i18n/service/i18n.service");
/**
 * Módulo principal de la aplicación.
 *
 * @author Robert Ene
 */
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            forms_1.FormsModule,
            app_routing_module_1.AppRoutingModule,
            auth_module_1.AuthModule,
            primeng_1.DropdownModule,
            primeng_1.GrowlModule,
            primeng_1.CalendarModule,
            primeng_1.CheckboxModule,
            primeng_1.InputTextModule,
            primeng_1.DataTableModule,
            primeng_1.SharedModule,
            primeng_1.FileUploadModule,
            primeng_1.InputSwitchModule,
            primeng_1.DialogModule,
            primeng_1.ButtonModule,
            primeng_1.ConfirmDialogModule,
        ],
        declarations: [
            app_component_1.AppComponent,
            login_component_1.LoginComponent,
            teacher_component_1.TeacherComponent,
            attendance_review_export_component_1.AttendanceReviewExportComponent,
            attendance_process_component_1.AttendanceProcessComponent,
            session_details_component_1.SessionDetailsComponent,
            qrcode_process_component_1.QrCodeProcessComponent,
            admin_component_1.AdminComponent,
            syllabus_component_1.SyllabusComponent,
            course_component_1.CourseComponent,
            subject_component_1.SubjectComponent,
            group_component_1.GroupComponent,
            teachers_component_1.TeachersComponent,
            students_component_1.StudentsComponent,
            session_component_1.SessionComponent,
            teacher_group_component_1.TeacherGroupComponent,
            student_group_component_1.StudentGroupComponent,
        ],
        providers: [
            { provide: router_1.UrlSerializer, useClass: url_serializer_1.CustomUrlSerializer },
            primeng_1.ConfirmationService,
            error_handler_service_1.ErrorHandlerService,
            http_service_1.HttpService,
            messages_service_1.MessagesService,
            auth_guard_service_1.AuthGuard,
            login_service_1.LoginService,
            teacher_service_1.TeacherService,
            admin_service_1.AdminService,
            i18n_service_1.i18nService,
            angular2_jwt_1.JwtHelper,
        ],
        bootstrap: [app_component_1.AppComponent],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map