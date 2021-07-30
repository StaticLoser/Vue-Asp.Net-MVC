"use strict";
/**
 * @description tooltip 事件
 * @author lkw
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShowHideFn = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var Tooltip_1 = tslib_1.__importDefault(require("../../menu-constructors/Tooltip"));
/**
 * 生成 Tooltip 的显示隐藏函数
 */
function createShowHideFn(editor) {
    var tooltip;
    /**
     * 显示 tooltip
     * @param $code 链接元素
     */
    function showCodeTooltip($code) {
        var i18nPrefix = 'menus.panelMenus.code.';
        var t = function (text, prefix) {
            if (prefix === void 0) { prefix = i18nPrefix; }
            return editor.i18next.t(prefix + text);
        };
        var conf = [
            {
                $elem: dom_core_1.default("<span>" + t('删除代码') + "</span>"),
                onClick: function (editor, $code) {
                    //dom操作删除
                    $code.remove();
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
        ];
        // 创建 tooltip
        tooltip = new Tooltip_1.default(editor, $code, conf);
        tooltip.create();
    }
    /**
     * 隐藏 tooltip
     */
    function hideCodeTooltip() {
        // 移除 tooltip
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
    return {
        showCodeTooltip: showCodeTooltip,
        hideCodeTooltip: hideCodeTooltip,
    };
}
exports.createShowHideFn = createShowHideFn;
/**
 * preEnterListener是为了统一浏览器 在pre标签内的enter行为而进行的监听
 * 目前并没有使用, 但是在未来处理与Firefox和ie的兼容性时需要用到 暂且放置
 * pre标签内的回车监听
 * @param e
 * @param editor
 */
/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function preEnterListener(e, editor) {
    // 获取当前标签元素
    var $selectionElem = editor.selection.getSelectionContainerElem();
    // 获取当前节点最顶级标签元素
    var $topElem = $selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.getNodeTop(editor);
    // 获取顶级节点节点名
    var topNodeName = $topElem === null || $topElem === void 0 ? void 0 : $topElem.getNodeName();
    // 非pre标签退出
    if (topNodeName !== 'PRE')
        return;
    // 取消默认行为
    e.preventDefault();
    // 执行换行
    editor.cmd.do('insertHTML', '\n\r');
}
/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
function bindTooltipEvent(editor) {
    var _a = createShowHideFn(editor), showCodeTooltip = _a.showCodeTooltip, hideCodeTooltip = _a.hideCodeTooltip;
    // 点击代码元素时，显示 tooltip
    editor.txt.eventHooks.codeClickEvents.push(showCodeTooltip);
    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideCodeTooltip);
    editor.txt.eventHooks.toolbarClickEvents.push(hideCodeTooltip);
    editor.txt.eventHooks.menuClickEvents.push(hideCodeTooltip);
    editor.txt.eventHooks.textScrollEvents.push(hideCodeTooltip);
}
exports.default = bindTooltipEvent;
//# sourceMappingURL=tooltip-event.js.map