"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @description 字号 class
 * @author lkw
 */
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
/**
 * FontSizeList 字号配置列表
 */
var FontSizeList = /** @class */ (function () {
    function FontSizeList(list) {
        this.itemList = [];
        for (var key in list) {
            var item = list[key];
            this.itemList.push({
                $elem: dom_core_1.default("<p style=\"font-size:" + key + "\">" + item.name + "</p>"),
                value: item.value,
            });
        }
    }
    FontSizeList.prototype.getItemList = function () {
        return this.itemList;
    };
    return FontSizeList;
}());
exports.default = FontSizeList;
//# sourceMappingURL=FontSizeList.js.map