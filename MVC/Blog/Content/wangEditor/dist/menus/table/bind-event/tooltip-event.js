"use strict";
/**
 * @description tooltip 事件
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var Tooltip_1 = tslib_1.__importDefault(require("../../menu-constructors/Tooltip"));
//操作事件
var operating_event_1 = tslib_1.__importDefault(require("./event/operating-event"));
var getNode_1 = tslib_1.__importDefault(require("./event/getNode"));
var const_1 = require("../../../utils/const");
/**
 * 生成 Tooltip 的显示隐藏函数
 */
function createShowHideFn(editor) {
    var tooltip;
    /**
     * 显示 tooltip
     * @param  table元素
     */
    function showTableTooltip($node) {
        var getnode = new getNode_1.default(editor);
        var i18nPrefix = 'menus.panelMenus.table.';
        var t = function (text, prefix) {
            if (prefix === void 0) { prefix = i18nPrefix; }
            return editor.i18next.t(prefix + text);
        };
        var conf = [
            {
                // $elem: $("<span class='w-e-icon-trash-o'></span>"),
                $elem: dom_core_1.default("<span>" + t('删除表格') + "</span>"),
                onClick: function (editor, $node) {
                    // 选中img元素
                    editor.selection.createRangeByElem($node);
                    editor.selection.restoreSelection();
                    editor.cmd.do('insertHTML', const_1.EMPTY_P);
                    // 返回 true，表示执行完之后，隐藏 tooltip。否则不隐藏。
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('添加行') + "</span>"),
                onClick: function (editor, $node) {
                    // 禁止多选操作
                    var isMore = isMoreRowAction(editor);
                    if (isMore) {
                        return true;
                    }
                    //当前元素
                    var selectDom = dom_core_1.default(editor.selection.getSelectionStartElem());
                    //当前行
                    var $currentRow = getnode.getRowNode(selectDom.elems[0]);
                    if (!$currentRow) {
                        return true;
                    }
                    //获取当前行的index
                    var index = Number(getnode.getCurrentRowIndex($node.elems[0], $currentRow));
                    //生成要替换的html
                    var htmlStr = getnode.getTableHtml($node.elems[0]);
                    //生成新的table
                    var newdom = getnode.getTableHtml(operating_event_1.default.ProcessingRow(dom_core_1.default(htmlStr), index).elems[0]);
                    newdom = _isEmptyP($node, newdom);
                    // 选中table
                    editor.selection.createRangeByElem($node);
                    editor.selection.restoreSelection();
                    editor.cmd.do('insertHTML', newdom);
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('删除行') + "</span>"),
                onClick: function (editor, $node) {
                    // 禁止多选操作
                    var isMore = isMoreRowAction(editor);
                    if (isMore) {
                        return true;
                    }
                    //当前元素
                    var selectDom = dom_core_1.default(editor.selection.getSelectionStartElem());
                    //当前行
                    var $currentRow = getnode.getRowNode(selectDom.elems[0]);
                    if (!$currentRow) {
                        return true;
                    }
                    //获取当前行的index
                    var index = Number(getnode.getCurrentRowIndex($node.elems[0], $currentRow));
                    //生成要替换的html
                    var htmlStr = getnode.getTableHtml($node.elems[0]);
                    //获取新生成的table 判断是否是最后一行被删除 是 删除整个table
                    var trLength = operating_event_1.default.DeleteRow(dom_core_1.default(htmlStr), index).elems[0]
                        .children[0].children.length;
                    //生成新的table
                    var newdom = '';
                    // 选中table
                    editor.selection.createRangeByElem($node);
                    editor.selection.restoreSelection();
                    if (trLength === 0) {
                        newdom = const_1.EMPTY_P;
                    }
                    else {
                        newdom = getnode.getTableHtml(operating_event_1.default.DeleteRow(dom_core_1.default(htmlStr), index).elems[0]);
                    }
                    newdom = _isEmptyP($node, newdom);
                    editor.cmd.do('insertHTML', newdom);
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('添加列') + "</span>"),
                onClick: function (editor, $node) {
                    // 禁止多选操作
                    var isMore = isMoreRowAction(editor);
                    if (isMore) {
                        return true;
                    }
                    //当前元素
                    var selectDom = dom_core_1.default(editor.selection.getSelectionStartElem());
                    //当前列的index
                    var index = getnode.getCurrentColIndex(selectDom.elems[0]);
                    //生成要替换的html
                    var htmlStr = getnode.getTableHtml($node.elems[0]);
                    //生成新的table
                    var newdom = getnode.getTableHtml(operating_event_1.default.ProcessingCol(dom_core_1.default(htmlStr), index).elems[0]);
                    newdom = _isEmptyP($node, newdom);
                    // 选中table
                    editor.selection.createRangeByElem($node);
                    editor.selection.restoreSelection();
                    editor.cmd.do('insertHTML', newdom);
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('删除列') + "</span>"),
                onClick: function (editor, $node) {
                    // 禁止多选操作
                    var isMore = isMoreRowAction(editor);
                    if (isMore) {
                        return true;
                    }
                    //当前元素
                    var selectDom = dom_core_1.default(editor.selection.getSelectionStartElem());
                    //当前列的index
                    var index = getnode.getCurrentColIndex(selectDom.elems[0]);
                    //生成要替换的html
                    var htmlStr = getnode.getTableHtml($node.elems[0]);
                    //获取新生成的table 判断是否是最后一列被删除 是 删除整个table
                    var newDom = operating_event_1.default.DeleteCol(dom_core_1.default(htmlStr), index);
                    // 获取子节点的数量
                    var tdLength = newDom.elems[0].children[0].children[0].children.length;
                    //生成新的table
                    var newdom = '';
                    // 选中table
                    editor.selection.createRangeByElem($node);
                    editor.selection.restoreSelection();
                    // 如果没有列了 则替换成空行
                    if (tdLength === 0) {
                        newdom = const_1.EMPTY_P;
                    }
                    else {
                        newdom = getnode.getTableHtml(newDom.elems[0]);
                    }
                    newdom = _isEmptyP($node, newdom);
                    editor.cmd.do('insertHTML', newdom);
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('设置表头') + "</span>"),
                onClick: function (editor, $node) {
                    // 禁止多选操作
                    var isMore = isMoreRowAction(editor);
                    if (isMore) {
                        return true;
                    }
                    //当前元素
                    var selectDom = dom_core_1.default(editor.selection.getSelectionStartElem());
                    //当前行
                    var $currentRow = getnode.getRowNode(selectDom.elems[0]);
                    if (!$currentRow) {
                        return true;
                    }
                    //获取当前行的index
                    var index = Number(getnode.getCurrentRowIndex($node.elems[0], $currentRow));
                    if (index !== 0) {
                        //控制在table的第一行
                        index = 0;
                    }
                    //生成要替换的html
                    var htmlStr = getnode.getTableHtml($node.elems[0]);
                    //生成新的table
                    var newdom = getnode.getTableHtml(operating_event_1.default.setTheHeader(dom_core_1.default(htmlStr), index, 'th').elems[0]);
                    newdom = _isEmptyP($node, newdom);
                    // 选中table
                    editor.selection.createRangeByElem($node);
                    editor.selection.restoreSelection();
                    editor.cmd.do('insertHTML', newdom);
                    return true;
                },
            },
            {
                $elem: dom_core_1.default("<span>" + t('取消表头') + "</span>"),
                onClick: function (editor, $node) {
                    //当前元素
                    var selectDom = dom_core_1.default(editor.selection.getSelectionStartElem());
                    //当前行
                    var $currentRow = getnode.getRowNode(selectDom.elems[0]);
                    if (!$currentRow) {
                        return true;
                    }
                    //获取当前行的index
                    var index = Number(getnode.getCurrentRowIndex($node.elems[0], $currentRow));
                    if (index !== 0) {
                        //控制在table的第一行
                        index = 0;
                    }
                    //生成要替换的html
                    var htmlStr = getnode.getTableHtml($node.elems[0]);
                    //生成新的table
                    var newdom = getnode.getTableHtml(operating_event_1.default.setTheHeader(dom_core_1.default(htmlStr), index, 'td').elems[0]);
                    newdom = _isEmptyP($node, newdom);
                    // 选中table
                    editor.selection.createRangeByElem($node);
                    editor.selection.restoreSelection();
                    editor.cmd.do('insertHTML', newdom);
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
    function hideTableTooltip() {
        // 移除 tooltip
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
    return {
        showTableTooltip: showTableTooltip,
        hideTableTooltip: hideTableTooltip,
    };
}
/**
 * 判断是否是多行
 */
function isMoreRowAction(editor) {
    var $startElem = editor.selection.getSelectionStartElem();
    var $endElem = editor.selection.getSelectionEndElem();
    if (($startElem === null || $startElem === void 0 ? void 0 : $startElem.elems[0]) !== ($endElem === null || $endElem === void 0 ? void 0 : $endElem.elems[0])) {
        return true;
    }
    else {
        return false;
    }
}
/**
 * 绑定 tooltip 事件
 * @param editor 编辑器实例
 */
function bindTooltipEvent(editor) {
    var _a = createShowHideFn(editor), showTableTooltip = _a.showTableTooltip, hideTableTooltip = _a.hideTableTooltip;
    // 点击table元素是，显示 tooltip
    editor.txt.eventHooks.tableClickEvents.push(showTableTooltip);
    // 点击其他地方，或者滚动时，隐藏 tooltip
    editor.txt.eventHooks.clickEvents.push(hideTableTooltip);
    editor.txt.eventHooks.keyupEvents.push(hideTableTooltip);
    editor.txt.eventHooks.toolbarClickEvents.push(hideTableTooltip);
    editor.txt.eventHooks.menuClickEvents.push(hideTableTooltip);
    editor.txt.eventHooks.textScrollEvents.push(hideTableTooltip);
}
exports.default = bindTooltipEvent;
/**
 * 判断表格的下一个节点是否是空行
 */
function _isEmptyP($node, newdom) {
    // 当表格的下一个兄弟节点是空行时，在 newdom 后添加 EMPTY_P
    var nextNode = $node.elems[0].nextSibling;
    if (!nextNode || nextNode.innerHTML === '<br>') {
        newdom += "" + const_1.EMPTY_P;
    }
    return newdom;
}
//# sourceMappingURL=tooltip-event.js.map