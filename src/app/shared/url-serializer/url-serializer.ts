import { Injectable } from '@angular/core';
import { UrlSerializer, DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * Clase que define un serializador/deserializador personalizado para las
 * URLs (routas) de la aplicación.
 *
 * @author Robert Ene
 */
export class CustomUrlSerializer implements UrlSerializer {
    private urlSerializer: DefaultUrlSerializer;

    constructor() {
        this.urlSerializer = new DefaultUrlSerializer();
    }

    parse(url: string): UrlTree {
        url.replace(/\+/g, '%20');
        return this.urlSerializer.parse(url);
    }

    serialize(tree: UrlTree): string {
        return this.urlSerializer.serialize(tree).replace(/%20/g, '+');
    }
}
