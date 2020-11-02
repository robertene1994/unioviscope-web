import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';

import { Message, SelectItem } from 'primeng/primeng';
import { User } from './model/user/user';

import { LoginService } from './login/service/login.service';
import { MessagesService } from './service/messages/messages.service';
import { i18nService } from './i18n/service/i18n.service';

import { showErrorTimeIntervalSeconds, defaultLocale } from './../app.config';

/**
 * Componente principal (raíz) de la aplicación.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'uniovi-scope-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    private static readonly showErrorTime = showErrorTimeIntervalSeconds * 1000;

    private messages: Message[];
    private languages: SelectItem[];
    private selectedLocale: string;
    private user: User;

    constructor(
        private router: Router,
        private location: PlatformLocation,
        private i18nService: i18nService,
        private zone: NgZone,
        private messagesService: MessagesService,
        private loginService: LoginService
    ) {
        this.messages = [];
        this.languages = [];
        this.languages.push({ label: 'Español', value: 'es-ES' });
        this.languages.push({ label: 'Inglés', value: 'en-US' });
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
        this.loginService.logOut();
    }

    ngOnInit(): void {
        this.messagesService.setContainer(this.messages);
        this.selectedLocale = this.i18nService.getLocale() as string;
        if (!this.selectedLocale) {
            this.selectedLocale = defaultLocale;
            this.i18nService.setLocale(defaultLocale);
        }

        this.location.onPopState(() => {
            if (this.location.pathname === '/login') {
                this.loginService.logOut();
            }
        });
    }

    get showErrorTime() {
        return AppComponent.showErrorTime;
    }

    logOut() {
        this.loginService.logOut();
        this.router.navigate(['login']);
    }

    changeLanguage(event: any) {
        this.i18nService.setLocale(event.value);
        this.zone.runOutsideAngular(() => {
            location.reload();
        });
    }
}
