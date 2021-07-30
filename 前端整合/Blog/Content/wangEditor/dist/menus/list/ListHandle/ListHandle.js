"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListHandle = void 0;
var tslib_1 = require("tslib");
var SelectionRangeElem_1 = tslib_1.__importDefault(require("../SelectionRangeElem"));
var ListHandle = /** @class */ (function () {
    function ListHandle(options) {
        this.options = options;
        this.selectionRangeElem = new SelectionRangeElem_1.default();
    }
    return ListHandle;
}());
exports.ListHandle = ListHandle;
//# sourceMappingURL=ListHandle.js.map