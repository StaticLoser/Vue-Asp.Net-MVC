"use strict";
/**
 * @description tooltip 事件
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShowHideFn = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var Tooltip_1 = tslib_1.__importDefault(require("../../menu-constructors/Tooltip"));
var video_alignment_1 = tslib_1.__importDefault(require("./video-alignment"));
/**
 * 生成 Tooltip 的显示隐藏函数
 */
function createShowHideFn(editor) {
    var tooltip;
    var t = function (text, prefix) {
        if (prefix === void 0) { prefix = ''; }
        return editor.i18next.t(prefix + text);
    };
    /**
     * 显示 tooltip
     * @param $node 链接元素
     */
    function showVideoTooltip($node) {
        var conf = [
            {
                $elem: dom_core_1.default("<span class='w-e-icon-trash-o'></span>"),
                onClick: function (editor, $node) {
                    // 选中video元素 删除
                    $node.remove();
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default('<span>100%</span>'),
                onClick: function (editor, $node) {
                    $node.attr('width', '100%');
                    $node.removeAttr('height');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default('<span>50%</span>'),
                onClick: function (editor, $node) {
                    $node.attr('width', '50%');
                    $node.removeAttr('height');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default('<span>30%</span>'),
                onClick: function (editor, $node) {
                    $node.attr('width', '30%');
                    $node.removeAttr('height');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('重置') + "</span>"),
                onClick: function (editor, $node) {
                    $node.removeAttr('width');
                    $node.removeAttr('height');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('menus.justify.靠左') + "</span>"),
                onClick: function (editor, $node) {
                    // 获取顶级元素
                    video_alignment_1.default($node, 'left');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('menus.justify.居中') + "</span>"),
                onClick: function (editor, $node) {
                    // 获取顶级元素
                    video_alignment_1.default($node, 'center');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('menus.justify.靠右') + "</span>"),
                onClick: function (editor, $node) {
                    // 获取顶级元素
                    video_alignment_1.default($node, 'right');
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
        ];
        tooltip = new Tooltip_1.default(editor, $node, conf);
        tooltip.create();
    }
    /**
     * 隐藏 tooltip
     */
    function hideVideoTooltip() {
        // 移除 tooltip
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
    return {
        showVideoTooltip: showVideoTooltip,
        hideVideoTooltip: hideVideoTooltip,
    };
}
exports.createShowHideFn = createShowHideFn;
/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
function bindTooltipEvent(editor) {
    var _a = createShowHideFn(editor), showVideoTooltip = _a.showVideoTooltip, hideVideoTooltip = _a.hideVideoTooltip;
    // 点击视频元素是，显示 tooltip
    editor.txt.eventHooks.videoClickEvents.push(showVideoTooltip);
    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideVideoTooltip);
    editor.txt.eventHooks.keyupEvents.push(hideVideoTooltip);
    editor.txt.eventHooks.toolbarClickEvents.push(hideVideoTooltip);
    editor.txt.eventHooks.menuClickEvents.push(hideVideoTooltip);
    editor.txt.eventHooks.textScrollEvents.push(hideVideoTooltip);
    // change 时隐藏
    editor.txt.eventHooks.changeEvents.push(hideVideoTooltip);
}
exports.default = bindTooltipEvent;
//# sourceMappingURL=tooltip-event.js.map