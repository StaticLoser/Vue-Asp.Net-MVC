"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindEventKeyboardEvent = exports.bindClickEvent = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
/**
 * @description 是否是空行
 * @param topElem
 */
function isEmptyLine(topElem) {
    if (!topElem.length) {
        return false;
    }
    var dom = topElem.elems[0];
    return dom.nodeName === 'P' && dom.innerHTML === '<br>';
}
function bindClickEvent(editor) {
    function handleTripleClick($dom, e) {
        // 处理三击事件，此时选区可能离开table，修正回来
        if (e.detail >= 3) {
            var selection = window.getSelection();
            if (selection) {
                var focusNode = selection.focusNode, anchorNode = selection.anchorNode;
                var $anchorNode = dom_core_1.default(anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.parentElement);
                // 当focusNode离开了table
                if (!$dom.isContain(dom_core_1.default(focusNode))) {
                    var $td = $anchorNode.elems[0].tagName === 'TD'
                        ? $anchorNode
                        : $anchorNode.parentUntilEditor('td', editor);
                    if ($td) {
                        var range = editor.selection.getRange();
                        range === null || range === void 0 ? void 0 : range.setEnd($td.elems[0], $td.elems[0].childNodes.length);
                        editor.selection.restoreSelection();
                    }
                }
            }
        }
    }
    editor.txt.eventHooks.tableClickEvents.push(handleTripleClick);
}
exports.bindClickEvent = bindClickEvent;
function bindEventKeyboardEvent(editor) {
    var txt = editor.txt, selection = editor.selection;
    var keydownEvents = txt.eventHooks.keydownEvents;
    keydownEvents.push(function (e) {
        // 实时保存选区
        editor.selection.saveRange();
        var $selectionContainerElem = selection.getSelectionContainerElem();
        if ($selectionContainerElem) {
            var $topElem = $selectionContainerElem.getNodeTop(editor);
            var $preElem = $topElem.length
                ? $topElem.prev().length
                    ? $topElem.prev()
                    : null
                : null;
            // 删除时，选区前面是table，且选区没有选中文本，阻止默认行为
            if ($preElem &&
                $preElem.getNodeName() === 'TABLE' &&
                selection.isSelectionEmpty() &&
                selection.getCursorPos() === 0 &&
                e.keyCode === 8) {
                var $nextElem = $topElem.next();
                var hasNext = !!$nextElem.length;
                /**
                 * 如果当前是空行，并且当前行下面还有内容，删除当前行
                 * 浏览器默认行为不会删除掉当前行的<br>标签
                 * 因此阻止默认行为，特殊处理
                 */
                if (hasNext && isEmptyLine($topElem)) {
                    $topElem.remove();
                    editor.selection.setRangeToElem($nextElem.elems[0]);
                }
                e.preventDefault();
            }
        }
    });
}
exports.bindEventKeyboardEvent = bindEventKeyboardEvent;
//# sourceMappingURL=table-event.js.map