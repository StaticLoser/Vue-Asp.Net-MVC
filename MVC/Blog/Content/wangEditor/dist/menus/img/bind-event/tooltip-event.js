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
    function showImgTooltip($node) {
        var conf = [
            {
                $elem: dom_core_1.default("<span class='w-e-icon-trash-o'></span>"),
                onClick: function (editor, $node) {
                    // 选中img元素
                    editor.selection.createRangeByElem($node);
                    editor.selection.restoreSelection();
                    editor.cmd.do('delete');
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
                $elem: dom_core_1.default('<span>50%</span>'),
                onClick: function (editor, $node) {
                    $node.attr('width', '50%');
                    $node.removeAttr('height');
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
        ];
        conf.push({
            $elem: dom_core_1.default("<span>" + t('重置') + "</span>"),
            onClick: function (editor, $node) {
                $node.removeAttr('width');
                $node.removeAttr('height');
                // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                return true;
            },
        });
        if ($node.attr('data-href')) {
            conf.push({
                $elem: dom_core_1.default("<span>" + t('查看链接') + "</span>"),
                onClick: function (editor, $node) {
                    var link = $node.attr('data-href');
                    if (link) {
                        link = decodeURIComponent(link);
                        window.open(link, '_target');
                    }
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            });
        }
        tooltip = new Tooltip_1.default(editor, $node, conf);
        tooltip.create();
    }
    /**
     * 隐藏 tooltip
     */
    function hideImgTooltip() {
        // 移除 tooltip
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
    return {
        showImgTooltip: showImgTooltip,
        hideImgTooltip: hideImgTooltip,
    };
}
exports.createShowHideFn = createShowHideFn;
/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
function bindTooltipEvent(editor) {
    var _a = createShowHideFn(editor), showImgTooltip = _a.showImgTooltip, hideImgTooltip = _a.hideImgTooltip;
    // 点击图片元素是，显示 tooltip
    editor.txt.eventHooks.imgClickEvents.push(showImgTooltip);
    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideImgTooltip);
    editor.txt.eventHooks.keyupEvents.push(hideImgTooltip);
    editor.txt.eventHooks.toolbarClickEvents.push(hideImgTooltip);
    editor.txt.eventHooks.menuClickEvents.push(hideImgTooltip);
    editor.txt.eventHooks.textScrollEvents.push(hideImgTooltip);
    editor.txt.eventHooks.imgDragBarMouseDownEvents.push(hideImgTooltip);
    // change 时隐藏
    editor.txt.eventHooks.changeEvents.push(hideImgTooltip);
}
exports.default = bindTooltipEvent;
//# sourceMappingURL=tooltip-event.js.map