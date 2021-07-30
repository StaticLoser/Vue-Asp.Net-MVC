"use strict";
/**
 * @description 重做
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var BtnMenu_1 = tslib_1.__importDefault(require("../menu-constructors/BtnMenu"));
var Redo = /** @class */ (function (_super) {
    tslib_1.__extends(Redo, _super);
    function Redo(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u6062\u590D\">\n                <i class=\"w-e-icon-redo\"></i>\n            </div>");
        _this = _super.call(this, $elem, editor) || this;
        return _this;
    }
    /**
     * 点击事件
     */
    Redo.prototype.clickHandler = function () {
        var editor = this.editor;
        editor.history.restore();
        // 重新创建 range，是处理当初始化编辑器，API插入内容后撤销，range 不在编辑器内部的问题
        var children = editor.$textElem.children();
        if (!(children === null || children === void 0 ? void 0 : children.length))
            return;
        var $last = children.last();
        editor.selection.createRangeByElem($last, false, true);
        editor.selection.restoreSelection();
    };
    /**
     * 尝试修改菜单激活状态
     */
    Redo.prototype.tryChangeActive = function () {
        // 标准模式下才进行操作
        if (!this.editor.isCompatibleMode) {
            if (this.editor.history.size[1]) {
                this.active();
            }
            else {
                this.unActive();
            }
        }
    };
    return Redo;
}(BtnMenu_1.default));
exports.default = Redo;
//# sourceMappingURL=index.js.map