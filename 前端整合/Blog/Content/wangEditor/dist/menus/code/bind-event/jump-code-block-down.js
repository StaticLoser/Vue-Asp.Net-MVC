"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @description 代码块为最后一块内容时往下跳出代码块
 * @author zhengwenjian
 */
var const_1 = require("../../../utils/const");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
/**
 * 在代码块最后一行 按方向下键跳出代码块的处理
 * @param editor 编辑器实例
 */
function bindEventJumpCodeBlock(editor) {
    var $textElem = editor.$textElem, selection = editor.selection, txt = editor.txt;
    var keydownEvents = txt.eventHooks.keydownEvents;
    keydownEvents.push(function (e) {
        var _a;
        // 40 是键盘中的下方向键
        if (e.keyCode !== 40)
            return;
        var node = selection.getSelectionContainerElem();
        var $lastNode = (_a = $textElem.children()) === null || _a === void 0 ? void 0 : _a.last();
        if ((node === null || node === void 0 ? void 0 : node.elems[0].tagName) === 'XMP' && ($lastNode === null || $lastNode === void 0 ? void 0 : $lastNode.elems[0].tagName) === 'PRE') {
            // 就是最后一块是代码块的情况插入空p标签并光标移至p
            var $emptyP = dom_core_1.default(const_1.EMPTY_P);
            $textElem.append($emptyP);
        }
    });
    // fix: 修复代码块作为最后一个元素时，用户无法再进行输入的问题
    keydownEvents.push(function (e) {
        // 实时保存选区
        editor.selection.saveRange();
        var $selectionContainerElem = selection.getSelectionContainerElem();
        if ($selectionContainerElem) {
            var $topElem = $selectionContainerElem.getNodeTop(editor);
            // 获取选区所在节点的上一元素
            var $preElem = $topElem === null || $topElem === void 0 ? void 0 : $topElem.prev();
            // 判断该元素后面是否还存在元素
            // 如果存在则允许删除
            var $nextElem = $topElem === null || $topElem === void 0 ? void 0 : $topElem.getNextSibling();
            if ($preElem.length && ($preElem === null || $preElem === void 0 ? void 0 : $preElem.getNodeName()) === 'PRE' && $nextElem.length === 0) {
                // 光标处于选区开头
                if (selection.getCursorPos() === 0) {
                    // 按下delete键阻止默认行为
                    if (e.keyCode === 8) {
                        e.preventDefault();
                    }
                }
            }
        }
    });
}
exports.default = bindEventJumpCodeBlock;
//# sourceMappingURL=jump-code-block-down.js.map