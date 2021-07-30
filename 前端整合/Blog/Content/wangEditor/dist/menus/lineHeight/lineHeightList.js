"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @description 行高 菜单
 * @author lichunlin
 */
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var lineHeightList = /** @class */ (function () {
    function lineHeightList(editor, list) {
        var _this = this;
        this.itemList = [{ $elem: dom_core_1.default("<span>" + editor.i18next.t('默认') + "</span>"), value: '' }];
        list.forEach(function (item) {
            _this.itemList.push({
                $elem: dom_core_1.default("<span>" + item + "</span>"),
                value: item,
            });
        });
    }
    lineHeightList.prototype.getItemList = function () {
        return this.itemList;
    };
    return lineHeightList;
}());
exports.default = lineHeightList;
//# sourceMappingURL=lineHeightList.js.map