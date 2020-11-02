import { NgModule, LOCALE_ID } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { i18nService } from './../../i18n/service/i18n.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions, i18n: i18nService) {
    return new AuthHttp(
        new AuthConfig({
            tokenName: 'token',
            noTokenScheme: true,
            tokenGetter: () => JSON.parse(localStorage.getItem('token')),
            globalHeaders: [{ 'Content-Type': 'application/json' }, { 'Accept-Language': i18n.getLocale() }],
        }),
        http,
        options
    );
}

/**
 * Módulo de autenticación HTTP para las peticiones realizadas contra la API de UniOviSCOPE.
 *
 * @author Robert Ene
 */
@NgModule({
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions, i18nService],
        },
    ],
})
export class AuthModule {}
