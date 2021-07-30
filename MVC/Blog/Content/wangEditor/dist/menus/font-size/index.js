"use strict";
/**
 * @description 字号 FontSize
 * @author lkw
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var FontSizeList_1 = tslib_1.__importDefault(require("./FontSizeList"));
var FontSize = /** @class */ (function (_super) {
    tslib_1.__extends(FontSize, _super);
    function FontSize(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u5B57\u53F7\">\n                <i class=\"w-e-icon-text-heigh\"></i>\n            </div>");
        var fontStyleList = new FontSizeList_1.default(editor.config.fontSizes);
        var fontListConf = {
            width: 160,
            title: '设置字号',
            type: 'list',
            list: fontStyleList.getItemList(),
            clickHandler: function (value) {
                // this 是指向当前的 FontSize 对象
                _this.command(value);
            },
        };
        _this = _super.call(this, $elem, editor, fontListConf) || this;
        return _this;
    }
    /**
     * 执行命令
     * @param value value
     */
    FontSize.prototype.command = function (value) {
        var _a;
        var editor = this.editor;
        var isEmptySelection = editor.selection.isSelectionEmpty();
        var selectionElem = (_a = editor.selection.getSelectionContainerElem()) === null || _a === void 0 ? void 0 : _a.elems[0];
        if (selectionElem == null)
            return;
        var isFont = (selectionElem === null || selectionElem === void 0 ? void 0 : selectionElem.nodeName.toLowerCase()) !== 'p';
        var isSameSize = (selectionElem === null || selectionElem === void 0 ? void 0 : selectionElem.getAttribute('size')) === value;
        if (isEmptySelection) {
            if (isFont && !isSameSize) {
                var $elems = editor.selection.getSelectionRangeTopNodes();
                var focusElem = $elems[0].elems[0];
                editor.selection.createRangeByElem($elems[0]);
                editor.selection.moveCursor(focusElem);
                selectionElem = focusElem;
            }
            editor.selection.setRangeToElem(selectionElem);
            // 插入空白选区
            editor.selection.createEmptyRange();
        }
        editor.cmd.do('fontSize', value);
        if (isEmptySelection) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    };
    /**
     * 尝试修改菜单激活状态
     * ?字号是否需要有激活状态这个操作?
     */
    FontSize.prototype.tryChangeActive = function () { };
    return FontSize;
}(DropListMenu_1.default));
exports.default = FontSize;
//# sourceMappingURL=index.js.map