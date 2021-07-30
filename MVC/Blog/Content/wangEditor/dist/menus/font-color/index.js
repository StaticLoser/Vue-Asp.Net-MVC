"use strict";
/**
 * @description 文字颜色 FontColor
 * @author lkw
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var FontColor = /** @class */ (function (_super) {
    tslib_1.__extends(FontColor, _super);
    function FontColor(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u6587\u5B57\u989C\u8272\">\n                <i class=\"w-e-icon-pencil2\"></i>\n            </div>");
        var colorListConf = {
            width: 120,
            title: '文字颜色',
            // droplist 内容以 block 形式展示
            type: 'inline-block',
            list: editor.config.colors.map(function (color) {
                return {
                    $elem: dom_core_1.default("<i style=\"color:" + color + ";\" class=\"w-e-icon-pencil2\"></i>"),
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
    FontColor.prototype.command = function (value) {
        var _a;
        var editor = this.editor;
        var isEmptySelection = editor.selection.isSelectionEmpty();
        var $selectionElem = (_a = editor.selection.getSelectionContainerElem()) === null || _a === void 0 ? void 0 : _a.elems[0];
        if ($selectionElem == null)
            return;
        var isFont = ($selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.nodeName.toLowerCase()) !== 'p';
        var isSameColor = ($selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.getAttribute('color')) === value;
        if (isEmptySelection) {
            if (isFont && !isSameColor) {
                var $elems = editor.selection.getSelectionRangeTopNodes();
                editor.selection.createRangeByElem($elems[0]);
                editor.selection.moveCursor($elems[0].elems[0]);
            }
            editor.selection.setRangeToElem($selectionElem);
            // 插入空白选区
            editor.selection.createEmptyRange();
        }
        // 获取选区范围的文字
        var $selectionText = editor.selection.getSelectionText();
        // 如果设置的是 a 标签就特殊处理一下，避免回车换行设置颜色无效的情况
        // 只处理选中a标签内全部文字的情况，因为选中部分文字不存在换行颜色失效的情况
        if ($selectionElem.nodeName === 'A' && $selectionElem.textContent === $selectionText) {
            // 创建一个相当于占位的元素
            var _payloadElem = dom_core_1.default('<span>&#8203;</span>').getNode();
            // 添加到a标签之后
            $selectionElem.appendChild(_payloadElem);
        }
        editor.cmd.do('foreColor', value);
        if (isEmptySelection) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    };
    /**
     * 尝试修改菜单激活状态
     */
    FontColor.prototype.tryChangeActive = function () { };
    return FontColor;
}(DropListMenu_1.default));
exports.default = FontColor;
//# sourceMappingURL=index.js.map