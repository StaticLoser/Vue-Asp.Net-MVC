"use strict";
/**
 * @description 背景颜色 BackColor
 * @author lkw
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var util_1 = require("../../utils/util");
var BackColor = /** @class */ (function (_super) {
    tslib_1.__extends(BackColor, _super);
    function BackColor(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u80CC\u666F\u8272\">\n                <i class=\"w-e-icon-paint-brush\"></i>\n            </div>");
        var colorListConf = {
            width: 120,
            title: '背景颜色',
            // droplist 内容以 block 形式展示
            type: 'inline-block',
            list: editor.config.colors.map(function (color) {
                return {
                    $elem: dom_core_1.default("<i style=\"color:" + color + ";\" class=\"w-e-icon-paint-brush\"></i>"),
                    value: color,
                };
            }),
            clickHandler: function (value) {
                // this 是指向当前的 BackColor 对象
                _this.command(value);
            },
        };
        _this = _super.call(this, $elem, editor, colorListConf) || this;
        return _this;
    }
    /**
     * 执行命令
     * @param value value
     */
    BackColor.prototype.command = function (value) {
        var _a;
        var editor = this.editor;
        var isEmptySelection = editor.selection.isSelectionEmpty();
        var $selectionElem = (_a = editor.selection.getSelectionContainerElem()) === null || _a === void 0 ? void 0 : _a.elems[0];
        if ($selectionElem == null)
            return;
        var isSpan = ($selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.nodeName.toLowerCase()) !== 'p';
        var bgColor = $selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.style.backgroundColor;
        var isSameColor = util_1.hexToRgb(value) === bgColor;
        if (isEmptySelection) {
            if (isSpan && !isSameColor) {
                var $elems = editor.selection.getSelectionRangeTopNodes();
                editor.selection.createRangeByElem($elems[0]);
                editor.selection.moveCursor($elems[0].elems[0]);
            }
            // 插入空白选区
            editor.selection.createEmptyRange();
        }
        editor.cmd.do('backColor', value);
        if (isEmptySelection) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    };
    /**
     * 尝试修改菜单激活状态
     */
    BackColor.prototype.tryChangeActive = function () { };
    return BackColor;
}(DropListMenu_1.default));
exports.default = BackColor;
//# sourceMappingURL=index.js.map