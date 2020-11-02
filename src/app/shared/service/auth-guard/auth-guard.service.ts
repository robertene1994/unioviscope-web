import { User } from './../../model/user/user';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginService } from './../../login/service/login.service';

/**
 * Servicios para la autenticación (sesión iniciada) y autorización (rol) de los usuarios de
 * la aplicación para cada una de las rutas/pantallas disponibles.
 *
 * @author Robert Ene
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let role = route.data['role'] as string;
        let user: User = this.loginService.getLoggedUser();

        if (role && user && user.role === role.toString() && this.loginService.isUserLoggedIn()) {
            return true;
        } else {
            this.loginService.logOut();
            this.router.navigate(['/']);
            return false;
        }
    }
}
