"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var const_1 = require("../../../utils/const");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
function bindEvent(editor) {
    function quoteEnter(e) {
        var _a;
        var $selectElem = editor.selection.getSelectionContainerElem();
        var $topSelectElem = editor.selection.getSelectionRangeTopNodes()[0];
        // 对quote的enter进行特殊处理
        //最后一行为空标签时再按会出跳出blockquote
        if (($topSelectElem === null || $topSelectElem === void 0 ? void 0 : $topSelectElem.getNodeName()) === 'BLOCKQUOTE') {
            // firefox下点击引用按钮会选中外容器<blockquote></blockquote>
            if ($selectElem.getNodeName() === 'BLOCKQUOTE') {
                var selectNode = (_a = $selectElem.childNodes()) === null || _a === void 0 ? void 0 : _a.getNode();
                editor.selection.moveCursor(selectNode);
            }
            if ($selectElem.text() === '') {
                e.preventDefault();
                $selectElem.remove();
                var $newLine = dom_core_1.default(const_1.EMPTY_P);
                $newLine.insertAfter($topSelectElem);
                // 将光标移动br前面
                editor.selection.moveCursor($newLine.getNode(), 0);
            }
            // 当blockQuote中没有内容回车后移除blockquote
            if ($topSelectElem.text() === '') {
                $topSelectElem.remove();
            }
        }
    }
    editor.txt.eventHooks.enterDownEvents.push(quoteEnter);
}
exports.default = bindEvent;
//# sourceMappingURL=index.js.map