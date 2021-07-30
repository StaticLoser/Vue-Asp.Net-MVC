"use strict";
/**
 * @description tooltip 事件
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
     * @param $link 链接元素
     */
    function showLinkTooltip($link) {
        var conf = [
            {
                $elem: dom_core_1.default("<span>" + editor.i18next.t('menus.panelMenus.link.查看链接') + "</span>"),
                onClick: function (editor, $link) {
                    var link = $link.attr('href');
                    window.open(link, '_target');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + editor.i18next.t('menus.panelMenus.link.取消链接') + "</span>"),
                onClick: function (editor, $link) {
                    // 选中链接元素
                    editor.selection.createRangeByElem($link);
                    editor.selection.restoreSelection();
                    // 用文字，替换链接
                    var selectionText = $link.text();
                    editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
        ];
        // 创建 tooltip
        tooltip = new Tooltip_1.default(editor, $link, conf);
        tooltip.create();
    }
    /**
     * 隐藏 tooltip
     */
    function hideLinkTooltip() {
        // 移除 tooltip
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
    return {
        showLinkTooltip: showLinkTooltip,
        hideLinkTooltip: hideLinkTooltip,
    };
}
/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
function bindTooltipEvent(editor) {
    var _a = createShowHideFn(editor), showLinkTooltip = _a.showLinkTooltip, hideLinkTooltip = _a.hideLinkTooltip;
    // 点击链接元素是，显示 tooltip
    editor.txt.eventHooks.linkClickEvents.push(showLinkTooltip);
    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideLinkTooltip);
    editor.txt.eventHooks.keyupEvents.push(hideLinkTooltip);
    editor.txt.eventHooks.toolbarClickEvents.push(hideLinkTooltip);
    editor.txt.eventHooks.menuClickEvents.push(hideLinkTooltip);
    editor.txt.eventHooks.textScrollEvents.push(hideLinkTooltip);
}
exports.default = bindTooltipEvent;
//# sourceMappingURL=tooltip-event.js.map