"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../utils/util");
function bindEventKeyboardEvent(editor) {
    if (!util_1.UA.isFirefox)
        return;
    var txt = editor.txt, selection = editor.selection;
    var keydownEvents = txt.eventHooks.keydownEvents;
    keydownEvents.push(function (e) {
        // 实时保存选区
        // editor.selection.saveRange()
        var $selectionContainerElem = selection.getSelectionContainerElem();
        if ($selectionContainerElem) {
            var $topElem = $selectionContainerElem.getNodeTop(editor);
            var $preElem = $topElem.length
                ? $topElem.prev().length
                    ? $topElem.prev()
                    : null
                : null;
            if ($preElem && $preElem.attr('data-we-video-p')) {
                // 光标处于选区开头
                if (selection.getCursorPos() === 0) {
                    // 如果上一个dom是包含video， 按下删除连video一块删除
                    if (e.keyCode === 8) {
                        $preElem.remove();
                    }
                }
            }
        }
    });
}
exports.default = bindEventKeyboardEvent;
//# sourceMappingURL=keyboard.js.map