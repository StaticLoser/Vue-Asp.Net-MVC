"use strict";
/**
 * @description 初始化编辑器选区，将光标定位到文档末尾
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var const_1 = require("../../utils/const");
/**
 * 初始化编辑器选区，将光标定位到文档末尾
 * @param editor 编辑器实例
 * @param newLine 是否新增一行
 */
function initSelection(editor, newLine) {
    var $textElem = editor.$textElem;
    var $children = $textElem.children();
    if (!$children || !$children.length) {
        // 如果编辑器区域无内容，添加一个空行，重新设置选区
        $textElem.append(dom_core_1.default(const_1.EMPTY_P));
        initSelection(editor);
        return;
    }
    var $last = $children.last();
    if (newLine) {
        // 新增一个空行
        var html = $last.html().toLowerCase();
        var nodeName = $last.getNodeName();
        if ((html !== '<br>' && html !== '<br/>') || nodeName !== 'P') {
            // 最后一个元素不是 空标签，添加一个空行，重新设置选区
            $textElem.append(dom_core_1.default(const_1.EMPTY_P));
            initSelection(editor);
            return;
        }
    }
    editor.selection.createRangeByElem($last, false, true);
    if (editor.config.focus) {
        editor.selection.restoreSelection();
    }
    else {
        // 防止focus=false受其他因素影响
        editor.selection.clearWindowSelectionRange();
    }
}
exports.default = initSelection;
//# sourceMappingURL=init-selection.js.map