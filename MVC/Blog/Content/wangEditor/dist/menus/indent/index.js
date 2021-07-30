"use strict";
/**
 * @description 增加缩进/减少缩进
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var operate_element_1 = tslib_1.__importDefault(require("./operate-element"));
var Indent = /** @class */ (function (_super) {
    tslib_1.__extends(Indent, _super);
    function Indent(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u7F29\u8FDB\">\n                <i class=\"w-e-icon-indent-increase\"></i>\n            </div>");
        var dropListConf = {
            width: 130,
            title: '设置缩进',
            type: 'list',
            list: [
                {
                    $elem: dom_core_1.default("<p>\n                            <i class=\"w-e-icon-indent-increase w-e-drop-list-item\"></i>\n                            " + editor.i18next.t('menus.dropListMenu.indent.增加缩进') + "\n                        <p>"),
                    value: 'increase',
                },
                {
                    $elem: dom_core_1.default("<p>\n                            <i class=\"w-e-icon-indent-decrease w-e-drop-list-item\"></i>\n                            " + editor.i18next.t('menus.dropListMenu.indent.减少缩进') + "\n                        <p>"),
                    value: 'decrease',
                },
            ],
            clickHandler: function (value) {
                // 注意 this 是指向当前的 Indent 对象
                _this.command(value);
            },
        };
        _this = _super.call(this, $elem, editor, dropListConf) || this;
        return _this;
    }
    /**
     * 执行命令
     * @param value value
     */
    Indent.prototype.command = function (value) {
        var editor = this.editor;
        var $selectionElem = editor.selection.getSelectionContainerElem();
        // 判断 当前选区为 textElem 时
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            // 当 当前选区 等于 textElem 时
            // 代表 当前选区 可能是一个选择了一个完整的段落或者多个段落
            var $elems = editor.selection.getSelectionRangeTopNodes();
            if ($elems.length > 0) {
                $elems.forEach(function (item) {
                    operate_element_1.default(dom_core_1.default(item), value, editor);
                });
            }
        }
        else {
            // 当 当前选区 不等于 textElem 时
            // 代表 当前选区要么是一个段落，要么是段落中的一部分
            if ($selectionElem && $selectionElem.length > 0) {
                $selectionElem.forEach(function (item) {
                    operate_element_1.default(dom_core_1.default(item), value, editor);
                });
            }
        }
        // 恢复选区
        editor.selection.restoreSelection();
        this.tryChangeActive();
    };
    /**
     * 尝试改变菜单激活（高亮）状态
     */
    Indent.prototype.tryChangeActive = function () {
        var editor = this.editor;
        var $selectionElem = editor.selection.getSelectionStartElem();
        var $selectionStartElem = dom_core_1.default($selectionElem).getNodeTop(editor);
        if ($selectionStartElem.length <= 0)
            return;
        if ($selectionStartElem.elems[0].style['paddingLeft'] != '') {
            this.active();
        }
        else {
            this.unActive();
        }
    };
    return Indent;
}(DropListMenu_1.default));
exports.default = Indent;
//# sourceMappingURL=index.js.map