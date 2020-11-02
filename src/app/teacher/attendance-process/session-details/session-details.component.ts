import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';

import { SelectItem } from 'primeng/primeng';

import { ErrorHandlerService } from './../../../shared/error-handler/error-handler.service';
import { LoginService } from './../../../shared/login/service/login.service';
import { TeacherService } from './../../shared/service/teacher.service';
import { MessagesService } from './../../../shared/service/messages/messages.service';

import { CalendarLocale } from './../../shared/model/calendar-locale/calendar-locale';
import { User } from './../../../shared/model/user/user';
import { Session } from './../../../shared/model/session/session';

import { info } from './../../../shared/types/severity-message';

/**
 * Componente para la pantalla de los detalles de una sesión determinada del docente.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'session-details',
    templateUrl: './session-details.component.html',
    styleUrls: ['./session-details.component.css'],
})
export class SessionDetailsComponent implements OnInit {
    private user: User;
    private session: Session;
    private startDate: Date;
    private endDate: Date;
    private locations: string[];
    private currentLocation: string;
    private currentDescription: string;

    private locationsSI: SelectItem[];

    private locale: CalendarLocale;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private loginService: LoginService,
        private teacherService: TeacherService,
        private messagesService: MessagesService,
        private errorHandlerService: ErrorHandlerService
    ) {
        this.locale = new CalendarLocale();
        this.locale.firstDayOfWeek = 1;
        this.locale.dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        this.locale.dayNamesShort = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
        this.locale.dayNamesMin = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        this.locale.monthNames = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];
        this.locale.monthNamesShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
        this.loginService.logOut();
    }

    ngOnInit() {
        this.user = this.loginService.getLoggedUser();
        this.getSession();
        this.getSessionLocations();
        this.currentLocation = this.session.location;
        this.currentDescription = this.session.description;
    }

    getSession() {
        this.route.params.subscribe((params) => {
            if (params['session']) {
                let session = JSON.parse(atob(params['session'])) as Session;
                this.session = session;
                this.startDate = new Date(this.session.start);
                this.endDate = new Date(this.session.end);
            }
        });
    }

    getSessionLocations() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.locations = [];
            this.locationsSI = [];
            this.teacherService
                .getSessionLocations(this.session.group.subject.subject.id)
                .then((locations) => {
                    this.locations = locations;
                    for (let i = 0; i < locations.length; i++) {
                        this.locationsSI.push({ label: locations[i], value: locations[i] });
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    goBack() {
        this.router.navigate(['attendanceProcess']);
    }

    createSession() {
        this.session.start = this.startDate.getTime();
        this.session.end = this.endDate.getTime();
        this.session.description = this.currentDescription;

        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .saveSession(this.session)
                .then((session) => {
                    this.session = session;
                    this.currentLocation = this.session.location;
                    this.messagesService.showMessage(
                        info,
                        `¡La sesión ha sido creada correctamente! 
            En este momento, es posible modificar los datos de la sesión creada!`
                    );
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    updateSession() {
        this.session.start = this.startDate.getTime();
        this.session.end = this.endDate.getTime();
        this.session.description = this.currentDescription;

        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.teacherService
                .updateSession(this.session)
                .then((session) => {
                    this.session = session;
                    this.currentLocation = this.session.location;
                    this.messagesService.showMessage(info, '¡Los datos de la sesión han sido modificados correctamente!');
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    openAttendanceProcess() {
        this.router.navigate(['/qrCodeProcess', btoa(JSON.stringify(this.session))]);
    }

    createOrUpdateSessionButtonState() {
        if (
            this.startDate !== undefined &&
            this.startDate.getTime() === this.session.start &&
            this.endDate !== undefined &&
            this.endDate.getTime() === this.session.end &&
            this.currentLocation !== undefined &&
            this.currentLocation === this.session.location &&
            this.currentDescription !== undefined &&
            (this.currentDescription.length === 0 || this.currentDescription === this.session.description)
        ) {
            return true;
        }
        return false;
    }

    openAttendanceProcessButtonState() {
        let currentDate = new Date().getTime();
        // return (this.session.start <= currentDate && currentDate <= this.session.end) ? false : true;
        return false;
    }
}
