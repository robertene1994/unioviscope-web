import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { MessagesService } from './../service/messages/messages.service';

import { User } from './../model/user/user';
import { ExceptionResponse } from './../model/exception-response/exception-response';

import { student } from './../types/role';
import { error } from './../types/severity-message';

/**
 * Servicio que sirve como manejador central para los errores.
 *
 * @author Robert Ene
 */
@Injectable()
export class ErrorHandlerService {
    constructor(private messagesService: MessagesService) {}

    handleExpiredSessionError(error: any) {
        if (error.message === 'No JWT present or has expired') {
            throw new Error('¡El nombre de usuario o la contraseña introducidos son incorrectos!');
        }
        throw error;
    }

    handleExceptionResponse(response: Response) {
        if (response.text()) {
            let exception = response.json() as ExceptionResponse;
            if (exception.field && exception.exception) {
                throw new Error('¡' + exception.message + '!');
            }
        }
    }

    handleImportExceptionResponse(response: XMLHttpRequest) {
        if (
            response.responseText &&
            response.responseText.length !== 0 &&
            response.responseText.indexOf('exception') !== -1 &&
            response.responseText.indexOf('message') !== -1
        ) {
            let exception = JSON.parse(response.responseText) as ExceptionResponse;
            this.messagesService.showMessage(error, '¡' + exception.message + '!');
            return false;
        }
        return true;
    }

    handleExportExceptionResponse(response: Response) {
        let blob = response.json() as Blob;
        if (blob.type === 'application/json') {
            this.messagesService.showMessage(error, '¡Ha ocurrido un error inesperado al procesar el fichero que se exportaba!');
            return false;
        }
        return true;
    }

    handleTimeOutError(): Observable<any> {
        return Observable.throw(
            new Error(`¡El servicio no está disponible en estos momentos! 
      ¡Por favor, pruebe de nuevo pasados unos minutos!`)
        );
    }

    handleUserRoleException(user: User) {
        if (user.role === student) {
            throw new Error('¡Solo se permite el acceso a los profesores y administradores del sistema!');
        }
    }

    handleNoInternetConnectionError() {
        if (!navigator.onLine) {
            this.messagesService.showMessage(error, '¡No hay una conexión a Internet!');
            return false;
        }
        return true;
    }

    handleError(e: Error | any) {
        if (e.message) {
            this.messagesService.showMessage(error, e.message);
        }
    }
}
