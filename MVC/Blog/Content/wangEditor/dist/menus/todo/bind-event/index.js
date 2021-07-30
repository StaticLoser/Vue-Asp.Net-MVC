"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var util_1 = require("../util");
var todo_1 = tslib_1.__importDefault(require("../todo"));
var util_2 = require("../util");
var const_1 = require("../../../utils/const");
/**
 * todolist 内部逻辑
 * @param editor
 */
function bindEvent(editor) {
    /**
     * todo的自定义回车事件
     * @param e 事件属性
     */
    function todoEnter(e) {
        var _a, _b;
        // 判断是否为todo节点
        if (util_1.isAllTodo(editor)) {
            e.preventDefault();
            var selection = editor.selection;
            var $topSelectElem = selection.getSelectionRangeTopNodes()[0];
            var $li = (_a = $topSelectElem.childNodes()) === null || _a === void 0 ? void 0 : _a.get(0);
            var selectionNode = (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.anchorNode;
            var range = selection.getRange();
            if (!(range === null || range === void 0 ? void 0 : range.collapsed)) {
                var rangeChildNodes = range === null || range === void 0 ? void 0 : range.commonAncestorContainer.childNodes;
                var startContainer_1 = range === null || range === void 0 ? void 0 : range.startContainer;
                var endContainer_1 = range === null || range === void 0 ? void 0 : range.endContainer;
                var startPos = range === null || range === void 0 ? void 0 : range.startOffset;
                var endPos = range === null || range === void 0 ? void 0 : range.endOffset;
                var startElemIndex_1 = 0;
                var endElemIndex_1 = 0;
                var delList_1 = [];
                // 找出startContainer和endContainer在rangeChildNodes中的位置
                rangeChildNodes === null || rangeChildNodes === void 0 ? void 0 : rangeChildNodes.forEach(function (v, i) {
                    if (v.contains(startContainer_1))
                        startElemIndex_1 = i;
                    if (v.contains(endContainer_1))
                        endElemIndex_1 = i;
                });
                // 删除两个容器间的内容
                if (endElemIndex_1 - startElemIndex_1 > 1) {
                    rangeChildNodes === null || rangeChildNodes === void 0 ? void 0 : rangeChildNodes.forEach(function (v, i) {
                        if (i <= startElemIndex_1)
                            return;
                        if (i >= endElemIndex_1)
                            return;
                        delList_1.push(v);
                    });
                    delList_1.forEach(function (v) {
                        v.remove();
                    });
                }
                // 删除两个容器里拖蓝的内容
                util_2.dealTextNode(startContainer_1, startPos);
                util_2.dealTextNode(endContainer_1, endPos, false);
                editor.selection.moveCursor(endContainer_1, 0);
            }
            // 回车时内容为空时，删去此行
            if ($topSelectElem.text() === '') {
                var $p = dom_core_1.default(const_1.EMPTY_P);
                $p.insertAfter($topSelectElem);
                selection.moveCursor($p.getNode());
                $topSelectElem.remove();
                return;
            }
            var pos = selection.getCursorPos();
            var CursorNextNode = util_1.getCursorNextNode($li === null || $li === void 0 ? void 0 : $li.getNode(), selectionNode, pos);
            var todo = todo_1.default(dom_core_1.default(CursorNextNode));
            var $inputcontainer = todo.getInputContainer();
            var todoLiElem = $inputcontainer.parent().getNode();
            var $newTodo = todo.getTodo();
            var contentSection = $inputcontainer.getNode().nextSibling;
            // 处理光标在最前面时回车input不显示的问题
            if (($li === null || $li === void 0 ? void 0 : $li.text()) === '') {
                $li === null || $li === void 0 ? void 0 : $li.append(dom_core_1.default("<br>"));
            }
            $newTodo.insertAfter($topSelectElem);
            // 处理在google中光标在最后面的，input不显示的问题(必须插入之后移动光标)
            if (!contentSection || (contentSection === null || contentSection === void 0 ? void 0 : contentSection.textContent) === '') {
                // 防止多个br出现的情况
                if ((contentSection === null || contentSection === void 0 ? void 0 : contentSection.nodeName) !== 'BR') {
                    var $br = dom_core_1.default("<br>");
                    $br.insertAfter($inputcontainer);
                }
                selection.moveCursor(todoLiElem, 1);
            }
            else {
                selection.moveCursor(todoLiElem);
            }
        }
    }
    /**
     * 自定义删除事件，用来处理光标在最前面删除input产生的问题
     */
    function delDown(e) {
        var _a, _b;
        if (util_1.isAllTodo(editor)) {
            var selection = editor.selection;
            var $topSelectElem = selection.getSelectionRangeTopNodes()[0];
            var $li = (_a = $topSelectElem.childNodes()) === null || _a === void 0 ? void 0 : _a.getNode();
            var $p = dom_core_1.default("<p></p>");
            var p_1 = $p.getNode();
            var selectionNode = (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.anchorNode;
            var pos = selection.getCursorPos();
            var prevNode = selectionNode.previousSibling;
            // 处理内容为空的情况
            if ($topSelectElem.text() === '') {
                e.preventDefault();
                var $newP = dom_core_1.default(const_1.EMPTY_P);
                $newP.insertAfter($topSelectElem);
                $topSelectElem.remove();
                selection.moveCursor($newP.getNode(), 0);
                return;
            }
            // 处理有内容时，光标在最前面的情况
            if ((prevNode === null || prevNode === void 0 ? void 0 : prevNode.nodeName) === 'SPAN' &&
                prevNode.childNodes[0].nodeName === 'INPUT' &&
                pos === 0) {
                e.preventDefault();
                $li === null || $li === void 0 ? void 0 : $li.childNodes.forEach(function (v, index) {
                    if (index === 0)
                        return;
                    p_1.appendChild(v.cloneNode(true));
                });
                $p.insertAfter($topSelectElem);
                $topSelectElem.remove();
            }
        }
    }
    /**
     * 自定义删除键up事件
     */
    function deleteUp() {
        var selection = editor.selection;
        var $topSelectElem = selection.getSelectionRangeTopNodes()[0];
        if ($topSelectElem && util_2.isTodo($topSelectElem)) {
            if ($topSelectElem.text() === '') {
                dom_core_1.default(const_1.EMPTY_P).insertAfter($topSelectElem);
                $topSelectElem.remove();
            }
        }
    }
    /**
     * input 的点击事件（ input 默认不会产生 attribute 的改变 ）
     * @param e 事件属性
     */
    function inputClick(e) {
        if (e && e.target instanceof HTMLInputElement) {
            if (e.target.type === 'checkbox') {
                if (e.target.checked) {
                    e.target.setAttribute('checked', 'true');
                }
                else {
                    e.target.removeAttribute('checked');
                }
            }
        }
    }
    editor.txt.eventHooks.enterDownEvents.push(todoEnter);
    editor.txt.eventHooks.deleteUpEvents.push(deleteUp);
    editor.txt.eventHooks.deleteDownEvents.push(delDown);
    editor.txt.eventHooks.clickEvents.push(inputClick);
}
exports.default = bindEvent;
//# sourceMappingURL=index.js.map