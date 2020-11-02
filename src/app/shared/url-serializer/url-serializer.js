"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
/**
 * Clase que define un serializador/deserializador personalizado para las
 * URLs (routas) de la aplicación.
 *
 * @author Robert Ene
 */
var CustomUrlSerializer = (function () {
    function CustomUrlSerializer() {
        this.urlSerializer = new router_1.DefaultUrlSerializer();
    }
    CustomUrlSerializer.prototype.parse = function (url) {
        url.replace(/\+/g, '%20');
        return this.urlSerializer.parse(url);
    };
    CustomUrlSerializer.prototype.serialize = function (tree) {
        return this.urlSerializer.serialize(tree).replace(/%20/g, '+');
    };
    return CustomUrlSerializer;
}());
exports.CustomUrlSerializer = CustomUrlSerializer;
//# sourceMappingURL=url-serializer.js.map