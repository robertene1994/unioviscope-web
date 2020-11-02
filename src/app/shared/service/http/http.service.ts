import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http';

import { AuthHttp } from 'angular2-jwt';

import { i18nService } from './../../i18n/service/i18n.service';
import { ErrorHandlerService } from './../../error-handler/error-handler.service';
import { MessagesService } from './../../service/messages/messages.service';

import { serviceTimeOutMillis } from './../../../app.config';

/**
 * Servicios para las peticiones realizadas contra la API de UniOviSCOPE,
 * tanto autenticadas como no.
 *
 * @author Robert Ene
 */
@Injectable()
export class HttpService {
    constructor(
        private http: Http,
        private httpAuth: AuthHttp,
        private i18nService: i18nService,
        private errorHandlerService: ErrorHandlerService
    ) {}

    post(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
        return this.http
            .post(url, body, options)
            .timeoutWith(serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError())
            .toPromise();
    }

    getAuth(url: string, options?: RequestOptionsArgs): Promise<Response> {
        return this.httpAuth.get(url, options).timeoutWith(serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError()).toPromise();
    }

    postAuth(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
        return this.httpAuth
            .post(url, body, options)
            .timeoutWith(serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError())
            .toPromise();
    }

    putAuth(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
        return this.httpAuth
            .put(url, body, options)
            .timeoutWith(serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError())
            .toPromise();
    }

    deleteAuth(url: string, options?: RequestOptionsArgs): Promise<Response> {
        return this.httpAuth
            .delete(url, options)
            .timeoutWith(serviceTimeOutMillis, this.errorHandlerService.handleTimeOutError())
            .toPromise();
    }

    setImportRequestHeaders(request: XMLHttpRequest) {
        request.setRequestHeader('Authorization', JSON.parse(localStorage.getItem('token')));
        request.setRequestHeader('Accept-Language', this.i18nService.getLocale() as string);
    }

    processImportResponse(request: XMLHttpRequest): File {
        return new File([request.responseText], request.getResponseHeader('X-Filename'));
    }
}
