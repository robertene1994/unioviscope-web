import { Injectable, Input, OnInit, OnDestroy } from '@angular/core';

import { Message } from 'primeng/primeng';

import { maxErrorsShown } from './../../../app.config';

/**
 * Servicios para el mecanismo de información del usuario mediante mensajes.
 *
 * @author Robert Ene
 */
@Injectable()
export class MessagesService implements OnInit, OnDestroy {
    @Input()
    private messages: Message[];

    ngOnInit() {
        this.messages = [];
    }

    setContainer(messages: Message[]) {
        this.messages = messages;
    }

    showMessage(severity: string, message: string, summary?: string) {
        if (this.messages.length >= maxErrorsShown) {
            this.messages.splice(0, 1);
        }

        if (summary) {
            this.messages.push({ severity: severity, summary: summary, detail: message });
        } else {
            this.messages.push({ severity: severity, detail: message });
        }
    }

    ngOnDestroy() {
        this.messages = [];
    }
}
