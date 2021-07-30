"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 选区的 Element
 * @author tonghan
 */
var SelectionRangeElem = /** @class */ (function () {
    function SelectionRangeElem() {
        this._element = null;
    }
    /**
     * 设置 SelectionRangeElem 的值
     * @param { SetSelectionRangeType } data
     */
    SelectionRangeElem.prototype.set = function (data) {
        //
        if (data instanceof DocumentFragment) {
            var childNode_1 = [];
            data.childNodes.forEach(function ($node) {
                childNode_1.push($node);
            });
            data = childNode_1;
        }
        this._element = data;
    };
    /**
     * 获取 SelectionRangeElem 的值
     * @returns { SelectionRangeType } Elem
     */
    SelectionRangeElem.prototype.get = function () {
        return this._element;
    };
    /**
     * 清除 SelectionRangeElem 的值
     */
    SelectionRangeElem.prototype.clear = function () {
        this._element = null;
    };
    return SelectionRangeElem;
}());
exports.default = SelectionRangeElem;
//# sourceMappingURL=SelectionRangeElem.js.map