import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams } from '@angular/http';

import * as CryptoJS from 'crypto-js';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { Account } from './../../model/account/account';
import { User } from './../../model/user/user';
import { HttpService } from './../../service/http/http.service';

import { QrCodeProcessComponent } from './../../../teacher/attendance-process/qrcode-process/qrcode-process.component';

import { ErrorHandlerService } from './../../error-handler/error-handler.service';

import { apiUrlCommon } from './../../../app.config';

/**
 * Servicios necesarios para el inicio de la sesión en el sistema.
 *
 * @author Robert Ene
 */
@Injectable()
export class LoginService {

  private qrCodeProcess: QrCodeProcessComponent;

  constructor(
    private http: HttpService,
    private errorHandlerService: ErrorHandlerService) { }

  logIn(account: Account): Promise<void> {

    return this.http.post(apiUrlCommon + '/logIn', JSON.stringify(account))
      .then((response) => {
        this.errorHandlerService.handleExceptionResponse(response);
        let token = response.headers.get('Authorization');
        if (token) {
          localStorage.setItem('token', JSON.stringify(token));
        }
      }).then(() => this.loadUserDetails(account))
      .catch(error => this.errorHandlerService.handleExpiredSessionError(error));
  }

  getLoggedUser(): User {
    let encodedStringUser = localStorage.getItem('user');
    if (encodedStringUser) {
      let token = localStorage.getItem('token');
      let encodedUser = JSON.parse(encodedStringUser);
      let decodedUser = CryptoJS.AES.decrypt(encodedUser.toString(), token);
      return JSON.parse(decodedUser.toString(CryptoJS.enc.Utf8)) as User;
    }
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('user')
      && localStorage.getItem('token') && tokenNotExpired();
  }

  logOut() {
    if (this.qrCodeProcess) {
      this.qrCodeProcess.stopQrCodeProcessFromOutside().then(() => {
        this.removeUserSession();
        this.qrCodeProcess = undefined;
      });
    } else {
      this.removeUserSession();
    }
  }

  setQrCodeProcess(qrCodeProcess: QrCodeProcessComponent) {
    this.qrCodeProcess = qrCodeProcess;
  }

  private removeUserSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private loadUserDetails(account: Account): Promise<void> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('userName', account.userName);
    let options = new RequestOptions();
    options.search = params;
    return this.http.getAuth(apiUrlCommon + '/findUserDetails', options)
      .then(response => {
        this.errorHandlerService.handleExceptionResponse(response);
        let token = localStorage.getItem('token');
        let user = response.json() as User;
        this.errorHandlerService.handleUserRoleException(user);
        let stringUser = JSON.stringify(user);
        let encodedUser = CryptoJS.AES.encrypt(stringUser, token);
        localStorage.setItem('user', JSON.stringify(encodedUser.toString()));
      });
  }
}
