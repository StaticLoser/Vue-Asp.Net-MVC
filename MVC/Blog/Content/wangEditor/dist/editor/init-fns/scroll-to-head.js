"use strict";
/**
 * @description 滚动到指定锚点
 * @author zhengwenjian
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 编辑器滚动到指定锚点
 * @param editor 编辑器实例
 * @param id 标题锚点id
 */
var scrollToHead = function (editor, id) {
    var $textElem = editor.isEnable
        ? editor.$textElem
        : editor.$textContainerElem.find('.w-e-content-mantle');
    var $targetHead = $textElem.find("[id='" + id + "']");
    var targetTop = $targetHead.getOffsetData().top;
    $textElem.scrollTop(targetTop);
};
exports.default = scrollToHead;
//# sourceMappingURL=scroll-to-head.js.map