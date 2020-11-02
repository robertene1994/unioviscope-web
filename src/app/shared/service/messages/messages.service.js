"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_config_1 = require("./../../../app.config");
/**
 * Servicios para el mecanismo de información del usuario mediante mensajes.
 *
 * @author Robert Ene
 */
var MessagesService = (function () {
    function MessagesService() {
    }
    MessagesService.prototype.ngOnInit = function () {
        this.messages = [];
    };
    MessagesService.prototype.setContainer = function (messages) {
        this.messages = messages;
    };
    MessagesService.prototype.showMessage = function (severity, message, summary) {
        if (this.messages.length >= app_config_1.maxErrorsShown) {
            this.messages.splice(0, 1);
        }
        if (summary) {
            this.messages.push({ severity: severity, summary: summary, detail: message });
        }
        else {
            this.messages.push({ severity: severity, detail: message });
        }
    };
    MessagesService.prototype.ngOnDestroy = function () {
        this.messages = [];
    };
    return MessagesService;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], MessagesService.prototype, "messages", void 0);
MessagesService = __decorate([
    core_1.Injectable()
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map