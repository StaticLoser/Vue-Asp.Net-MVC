"use strict";
/**
 * @description 编辑区域 tab 的特殊处理
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 编辑区域 tab 的特殊处理，转换为空格
 * @param editor 编辑器实例
 * @param tabDownEvents tab down 事件钩子
 */
function tabHandler(editor, tabDownEvents) {
    // 定义函数
    function fn() {
        if (!editor.cmd.queryCommandSupported('insertHTML')) {
            // 必须原生支持 insertHTML 命令
            return;
        }
        var $selectionElem = editor.selection.getSelectionContainerElem();
        if (!$selectionElem) {
            return;
        }
        var $parentElem = $selectionElem.parent();
        var selectionNodeName = $selectionElem.getNodeName();
        var parentNodeName = $parentElem.getNodeName();
        if (selectionNodeName == 'CODE' ||
            parentNodeName === 'CODE' ||
            parentNodeName === 'PRE' ||
            /hljs/.test(parentNodeName)) {
            // <pre><code> 里面
            editor.cmd.do('insertHTML', editor.config.languageTab);
        }
        else {
            // 普通文字
            editor.cmd.do('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    }
    // 保留函数
    tabDownEvents.push(fn);
}
exports.default = tabHandler;
//# sourceMappingURL=tab-to-space.js.map