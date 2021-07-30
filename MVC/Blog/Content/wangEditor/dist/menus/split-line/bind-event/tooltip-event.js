"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @description tooltip 事件
 * @author wangqiaoling
 */
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var Tooltip_1 = tslib_1.__importDefault(require("../../menu-constructors/Tooltip"));
/**
 * 生成 Tooltip 的显示隐藏函数
 */
function createShowHideFn(editor) {
    var tooltip;
    /**
     * 显示分割线的 tooltip
     * @param $splitLine 分割线元素
     */
    function showSplitLineTooltip($splitLine) {
        // 定义 splitLine tooltip 配置
        var conf = [
            {
                $elem: dom_core_1.default("<span>" + editor.i18next.t('menus.panelMenus.删除') + "</span>"),
                onClick: function (editor, $splitLine) {
                    // 选中 分割线 元素
                    editor.selection.createRangeByElem($splitLine);
                    editor.selection.restoreSelection();
                    editor.cmd.do('delete');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
        ];
        // 实例化 tooltip
        tooltip = new Tooltip_1.default(editor, $splitLine, conf);
        // 创建 tooltip
        tooltip.create();
    }
    /**
     * 隐藏分割线的 tooltip
     */
    function hideSplitLineTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
    return {
        showSplitLineTooltip: showSplitLineTooltip,
        hideSplitLineTooltip: hideSplitLineTooltip,
    };
}
function bindTooltipEvent(editor) {
    var _a = createShowHideFn(editor), showSplitLineTooltip = _a.showSplitLineTooltip, hideSplitLineTooltip = _a.hideSplitLineTooltip;
    // 点击分割线时，显示 tooltip
    editor.txt.eventHooks.splitLineEvents.push(showSplitLineTooltip);
    // 点击其他地方（工具栏、滚动、keyup）时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideSplitLineTooltip);
    editor.txt.eventHooks.keyupEvents.push(hideSplitLineTooltip);
    editor.txt.eventHooks.toolbarClickEvents.push(hideSplitLineTooltip);
    editor.txt.eventHooks.menuClickEvents.push(hideSplitLineTooltip);
    editor.txt.eventHooks.textScrollEvents.push(hideSplitLineTooltip);
}
exports.default = bindTooltipEvent;
//# sourceMappingURL=tooltip-event.js.map