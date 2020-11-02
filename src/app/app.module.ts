import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';

import {
    DropdownModule,
    GrowlModule,
    CalendarModule,
    CheckboxModule,
    InputTextModule,
    DataTableModule,
    SharedModule,
    FileUploadModule,
    InputSwitchModule,
    DialogModule,
    ButtonModule,
    ConfirmDialogModule,
    ConfirmationService,
} from 'primeng/primeng';

import { CustomUrlSerializer } from './shared/url-serializer/url-serializer';

import { JwtHelper } from 'angular2-jwt';

import { AuthModule } from './shared/service/auth/auth.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './shared/app.component';
import { LoginComponent } from './shared/login/login.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AttendanceProcessComponent } from './teacher/attendance-process/attendance-process.component';
import { SessionDetailsComponent } from './teacher/attendance-process/session-details/session-details.component';
import { QrCodeProcessComponent } from './teacher/attendance-process/qrcode-process/qrcode-process.component';
import { AttendanceReviewExportComponent } from './teacher/attendance-review-export/attendance-review-export.component';
import { AdminComponent } from './admin/admin.component';
import { SyllabusComponent } from './admin/syllabus/syllabus.component';
import { CourseComponent } from './admin/course/course.component';
import { SubjectComponent } from './admin/subject/subject.component';
import { GroupComponent } from './admin/group/group.component';
import { TeachersComponent } from './admin/teachers/teachers.component';
import { StudentsComponent } from './admin/students/students.component';
import { SessionComponent } from './admin/session/session.component';
import { TeacherGroupComponent } from './admin/teacher-group/teacher-group.component';
import { StudentGroupComponent } from './admin/student-group/student-group.component';

import { HttpService } from './shared/service/http/http.service';
import { ErrorHandlerService } from './shared/error-handler/error-handler.service';
import { MessagesService } from './shared/service/messages/messages.service';
import { AuthGuard } from './shared/service/auth-guard/auth-guard.service';
import { LoginService } from './shared/login/service/login.service';
import { TeacherService } from './teacher/shared/service/teacher.service';
import { AdminService } from './admin/shared/service/admin.service';
import { i18nService } from './shared/i18n/service/i18n.service';

/**
 * Módulo principal de la aplicación.
 *
 * @author Robert Ene
 */
@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        AppRoutingModule,
        AuthModule,
        DropdownModule,
        GrowlModule,
        CalendarModule,
        CheckboxModule,
        InputTextModule,
        DataTableModule,
        SharedModule,
        FileUploadModule,
        InputSwitchModule,
        DialogModule,
        ButtonModule,
        ConfirmDialogModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        TeacherComponent,
        AttendanceReviewExportComponent,
        AttendanceProcessComponent,
        SessionDetailsComponent,
        QrCodeProcessComponent,
        AdminComponent,
        SyllabusComponent,
        CourseComponent,
        SubjectComponent,
        GroupComponent,
        TeachersComponent,
        StudentsComponent,
        SessionComponent,
        TeacherGroupComponent,
        StudentGroupComponent,
    ],
    providers: [
        { provide: UrlSerializer, useClass: CustomUrlSerializer },
        ConfirmationService,
        ErrorHandlerService,
        HttpService,
        MessagesService,
        AuthGuard,
        LoginService,
        TeacherService,
        AdminService,
        i18nService,
        JwtHelper,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
