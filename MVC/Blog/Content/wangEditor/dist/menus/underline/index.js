"use strict";
/**
 * @description 下划线 underline
 * @author dyl
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BtnMenu_1 = tslib_1.__importDefault(require("../menu-constructors/BtnMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var Underline = /** @class */ (function (_super) {
    tslib_1.__extends(Underline, _super);
    function Underline(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u4E0B\u5212\u7EBF\">\n                <i class=\"w-e-icon-underline\"></i>\n            </div>");
        _this = _super.call(this, $elem, editor) || this;
        return _this;
    }
    /**
     * 点击事件
     */
    Underline.prototype.clickHandler = function () {
        var editor = this.editor;
        var isSelectEmpty = editor.selection.isSelectionEmpty();
        if (isSelectEmpty) {
            // 选区范围是空的，插入并选中一个“空白”
            editor.selection.createEmptyRange();
        }
        // 执行 Underline 命令
        editor.cmd.do('underline');
        if (isSelectEmpty) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    };
    /**
     * 尝试修改菜单激活状态
     */
    Underline.prototype.tryChangeActive = function () {
        var editor = this.editor;
        if (editor.cmd.queryCommandState('underline')) {
            this.active();
        }
        else {
            this.unActive();
        }
    };
    return Underline;
}(BtnMenu_1.default));
exports.default = Underline;
//# sourceMappingURL=index.js.map