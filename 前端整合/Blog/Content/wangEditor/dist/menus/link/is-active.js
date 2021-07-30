"use strict";
/**
 * @description 检查选区是否在链接中，即菜单是否应该 active
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
function isActive(editor) {
    var $selectionELem = editor.selection.getSelectionContainerElem();
    if (!($selectionELem === null || $selectionELem === void 0 ? void 0 : $selectionELem.length)) {
        return false;
    }
    if ($selectionELem.getNodeName() === 'A') {
        return true;
    }
    else {
        return false;
    }
}
exports.default = isActive;
//# sourceMappingURL=is-active.js.map