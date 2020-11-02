import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';

export function getTranslationProviders(): Promise<Object[]> {
    const locale = localStorage.getItem('localeId') as string;
    const noProviders: Object[] = [];

    if (!locale) {
        return Promise.resolve(noProviders);
    }

    const translationFile = `./lang/messages_${locale}.xlf`;
    return getTranslationsWithSystemJs(translationFile)
        .then((translations: string) => [
            { provide: TRANSLATIONS, useValue: translations },
            { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
            { provide: LOCALE_ID, useValue: locale },
        ])
        .catch(() => noProviders);
}

declare var System: any;

function getTranslationsWithSystemJs(file: string) {
    return System.import(file + '!text');
}
