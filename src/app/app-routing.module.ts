import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './shared/login/login.component';
import { AttendanceReviewExportComponent } from './teacher/attendance-review-export/attendance-review-export.component';
import { AttendanceProcessComponent } from './teacher/attendance-process/attendance-process.component';
import { SessionDetailsComponent } from './teacher/attendance-process/session-details/session-details.component';
import { QrCodeProcessComponent } from './teacher/attendance-process/qrcode-process/qrcode-process.component';
import { SyllabusComponent } from './admin/syllabus/syllabus.component';
import { SubjectComponent } from './admin/subject/subject.component';
import { CourseComponent } from './admin/course/course.component';
import { GroupComponent } from './admin/group/group.component';
import { TeachersComponent } from './admin/teachers/teachers.component';
import { StudentsComponent } from './admin/students/students.component';
import { SessionComponent } from './admin/session/session.component';
import { TeacherGroupComponent } from './admin/teacher-group/teacher-group.component';
import { StudentGroupComponent } from './admin/student-group/student-group.component';

import { AuthGuard } from './shared/service/auth-guard/auth-guard.service';

import { admin, teacher } from './shared/types/role';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'teacher', redirectTo: '/attendanceProcess', canActivate: [AuthGuard], data: { role: teacher } },
    { path: 'attendanceProcess', component: AttendanceProcessComponent, canActivate: [AuthGuard], data: { role: teacher } },
    { path: 'sessionDetails/:session', component: SessionDetailsComponent, canActivate: [AuthGuard], data: { role: teacher } },
    { path: 'qrCodeProcess/:session', component: QrCodeProcessComponent, canActivate: [AuthGuard], data: { role: teacher } },
    { path: 'attendanceReviewExport', component: AttendanceReviewExportComponent, canActivate: [AuthGuard], data: { role: teacher } },
    { path: 'admin', redirectTo: '/syllabus', canActivate: [AuthGuard], data: { role: admin } },
    { path: 'syllabus', component: SyllabusComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: 'subject', component: SubjectComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: 'course', component: CourseComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: 'group', component: GroupComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: 'teachers', component: TeachersComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: 'students', component: StudentsComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: 'session', component: SessionComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: 'teacherGroup', component: TeacherGroupComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: 'studentGroup', component: StudentGroupComponent, canActivate: [AuthGuard], data: { role: admin } },
    { path: '**', redirectTo: '/login' },
];

/**
 * Módulo que define las rutas para las diferentes funcionalidades ofrecidas.
 *
 * @author Robert Ene
 */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
