"use strict";
/**
 * @description 字体样式 FontStyle
 * @author dyl
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var FontStyleList_1 = tslib_1.__importDefault(require("./FontStyleList"));
var FontStyle = /** @class */ (function (_super) {
    tslib_1.__extends(FontStyle, _super);
    function FontStyle(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u5B57\u4F53\">\n                <i class=\"w-e-icon-font\"></i>\n            </div>");
        var fontStyleList = new FontStyleList_1.default(editor.config.fontNames);
        var fontListConf = {
            width: 100,
            title: '设置字体',
            type: 'list',
            list: fontStyleList.getItemList(),
            clickHandler: function (value) {
                // this 是指向当前的 FontStyle 对象
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
    FontStyle.prototype.command = function (value) {
        var _a;
        var editor = this.editor;
        var isEmptySelection = editor.selection.isSelectionEmpty();
        var $selectionElem = (_a = editor.selection.getSelectionContainerElem()) === null || _a === void 0 ? void 0 : _a.elems[0];
        if ($selectionElem == null)
            return;
        var isFont = ($selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.nodeName.toLowerCase()) !== 'p';
        var isSameValue = ($selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.getAttribute('face')) === value;
        if (isEmptySelection) {
            if (isFont && !isSameValue) {
                var $elems = editor.selection.getSelectionRangeTopNodes();
                editor.selection.createRangeByElem($elems[0]);
                editor.selection.moveCursor($elems[0].elems[0]);
            }
            editor.selection.setRangeToElem($selectionElem);
            // 插入空白选区
            editor.selection.createEmptyRange();
        }
        editor.cmd.do('fontName', value);
        if (isEmptySelection) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    };
    /**
     * 尝试修改菜单激活状态
     * ?字体是否需要有激活状态这个操作?
     */
    FontStyle.prototype.tryChangeActive = function () {
        // const editor = this.editor
        // const cmdValue = editor.cmd.queryCommandValue('fontName')
        // if (menusConfig.fontNames.indexOf(cmdValue) >= 0) {
        //     this.active()
        // } else {
        //     this.unActive()
        // }
    };
    return FontStyle;
}(DropListMenu_1.default));
exports.default = FontStyle;
//# sourceMappingURL=index.js.map