import { Message } from 'primeng/primeng';
import { error } from './../types/severity-message';
import { MessagesService } from './../service/messages/messages.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './service/login.service';
import { ErrorHandlerService } from './../error-handler/error-handler.service';

import { Account } from './../model/account/account';
import { admin, teacher } from './../types/role';

/**
 * Componente de la pantalla para el inicio de sesión.
 *
 * @author Robert Ene
 */
@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    private account: Account;

    constructor(
        private router: Router,
        private loginService: LoginService,
        private errorHandlerService: ErrorHandlerService,
        private messagesService: MessagesService
    ) {
        this.account = new Account();
    }

    logIn() {
        if (this.errorHandlerService.handleNoInternetConnectionError()) {
            this.loginService
                .logIn(this.account)
                .then(() => {
                    let user = this.loginService.getLoggedUser();
                    if (user) {
                        if (user.role === admin) {
                            this.router.navigate(['/syllabus']);
                        } else if (user.role === teacher) {
                            this.router.navigate(['/attendanceProcess']);
                        }
                    }
                })
                .catch((error) => this.errorHandlerService.handleError(error));
        }
    }

    logInButtonState() {
        if (
            this.account === undefined ||
            this.account.userName === undefined ||
            this.account.userName.length === 0 ||
            this.account.password === undefined ||
            this.account.password.length === 0
        ) {
            return true;
        }
        return false;
    }
}
