import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './../shared/login/service/login.service';

import { User } from './../shared/model/user/user';

/**
 * Componente de la pantalla (raíz) para todas las demás pantallas del administrador.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
    private user: User;

    constructor(private loginService: LoginService, private router: Router) {}

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: any) {
        this.loginService.logOut();
    }

    ngOnInit() {
        this.user = this.loginService.getLoggedUser();
    }
}
