import { Injectable } from '@angular/core';

/**
 * Servicio para la internacionalización de la aplicación.
 *
 * @author Robert Ene
 */
@Injectable()
export class i18nService {
    getLocale(): String {
        let locale = localStorage.getItem('localeId');
        return locale;
    }

    setLocale(locale: string) {
        localStorage.setItem('localeId', locale);
    }
}
