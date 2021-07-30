"use strict";
/**
 * @description 删除时保留 EMPTY_P
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cutToKeepP = void 0;
var tslib_1 = require("tslib");
var const_1 = require("../../utils/const");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
/**
 * 删除时保留 EMPTY_P
 * @param editor 编辑器实例
 * @param deleteUpEvents delete 键 up 时的 hooks
 * @param deleteDownEvents delete 建 down 时的 hooks
 */
function deleteToKeepP(editor, deleteUpEvents, deleteDownEvents) {
    function upFn() {
        var $textElem = editor.$textElem;
        var html = editor.$textElem.html();
        var text = editor.$textElem.text();
        var txtHtml = html.trim();
        var emptyTags = ['<p><br></p>', '<br>', const_1.EMPTY_P];
        // 编辑器中的字符是""或空白，说明内容为空
        if (/^\s*$/.test(text) && (!txtHtml || emptyTags.includes(txtHtml))) {
            // 内容空了
            var $p = dom_core_1.default(const_1.EMPTY_P);
            $textElem.html(' '); // 一定要先清空，否则在 firefox 下有问题
            $textElem.append($p);
            editor.selection.createRangeByElem($p, false, true);
            editor.selection.restoreSelection();
            // 设置折叠后的光标位置，在firebox等浏览器下
            // 光标设置在end位置会自动换行
            editor.selection.moveCursor($p.getNode(), 0);
        }
    }
    deleteUpEvents.push(upFn);
    function downFn(e) {
        var $textElem = editor.$textElem;
        var txtHtml = $textElem.html().toLowerCase().trim();
        if (txtHtml === const_1.EMPTY_P) {
            // 最后剩下一个空行，就不再删除了
            e.preventDefault();
            return;
        }
    }
    deleteDownEvents.push(downFn);
}
/**
 * 剪切时保留 EMPTY_P
 * @param editor 编辑器实例
 * @param cutEvents keydown hooks
 */
function cutToKeepP(editor, cutEvents) {
    function upFn(e) {
        if (e.keyCode !== 88) {
            return;
        }
        var $textElem = editor.$textElem;
        var txtHtml = $textElem.html().toLowerCase().trim();
        // firefox 时用 txtHtml === '<br>' 判断，其他用 !txtHtml 判断
        if (!txtHtml || txtHtml === '<br>') {
            // 内容空了
            var $p = dom_core_1.default(const_1.EMPTY_P);
            $textElem.html(' '); // 一定要先清空，否则在 firefox 下有问题
            $textElem.append($p);
            editor.selection.createRangeByElem($p, false, true);
            editor.selection.restoreSelection();
            // 设置折叠后的光标位置，在firebox等浏览器下
            // 光标设置在end位置会自动换行
            editor.selection.moveCursor($p.getNode(), 0);
        }
    }
    cutEvents.push(upFn);
}
exports.cutToKeepP = cutToKeepP;
exports.default = deleteToKeepP;
//# sourceMappingURL=del-to-keep-p.js.map