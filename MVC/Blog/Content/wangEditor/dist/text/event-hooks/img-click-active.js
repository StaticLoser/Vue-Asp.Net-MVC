"use strict";
/**
 * @description 图片点击后选区更新到img的位置
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 图片点击后选区更新到img的位置
 * @param editor 编辑器实例
 * @param imgClickEvents delete 键 up 时的 hooks
 */
function imgClickActive(editor, imgClickEvents) {
    function clickFn($img) {
        editor.selection.createRangeByElem($img);
        editor.selection.restoreSelection();
    }
    imgClickEvents.push(clickFn);
}
exports.default = imgClickActive;
//# sourceMappingURL=img-click-active.js.map