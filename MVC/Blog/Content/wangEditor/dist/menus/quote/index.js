"use strict";
/**
 * @description 引用
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var BtnMenu_1 = tslib_1.__importDefault(require("../menu-constructors/BtnMenu"));
var bind_event_1 = tslib_1.__importDefault(require("./bind-event"));
var create_quote_node_1 = tslib_1.__importDefault(require("./create-quote-node"));
var const_1 = require("../../utils/const");
var Quote = /** @class */ (function (_super) {
    tslib_1.__extends(Quote, _super);
    function Quote(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u5F15\u7528\">\n                <i class=\"w-e-icon-quotes-left\"></i>\n            </div>");
        _this = _super.call(this, $elem, editor) || this;
        bind_event_1.default(editor);
        return _this;
    }
    /**
     * 点击事件
     */
    Quote.prototype.clickHandler = function () {
        var _a;
        var editor = this.editor;
        var isSelectEmpty = editor.selection.isSelectionEmpty();
        var topNodeElem = editor.selection.getSelectionRangeTopNodes();
        var $topNodeElem = topNodeElem[topNodeElem.length - 1];
        var nodeName = this.getTopNodeName();
        // IE 中不支持 formatBlock <BLOCKQUOTE> ，要用其他方式兼容
        // 兼容firefox无法取消blockquote的问题
        if (nodeName === 'BLOCKQUOTE') {
            // 撤销 quote
            var $targetELem = dom_core_1.default($topNodeElem.childNodes());
            var len = $targetELem.length;
            var $middle_1 = $topNodeElem;
            $targetELem.forEach(function (elem) {
                var $elem = dom_core_1.default(elem);
                $elem.insertAfter($middle_1);
                $middle_1 = $elem;
            });
            $topNodeElem.remove();
            editor.selection.moveCursor($targetELem.elems[len - 1]);
            // 即时更新btn状态
            this.tryChangeActive();
        }
        else {
            // 将 P 转换为 quote
            var $quote = create_quote_node_1.default(topNodeElem);
            $quote.insertAfter($topNodeElem);
            this.delSelectNode(topNodeElem);
            var moveNode = (_a = $quote.childNodes()) === null || _a === void 0 ? void 0 : _a.last().getNode();
            if (moveNode == null)
                return;
            // 兼容firefox（firefox下空行情况下选区会在br后，造成自动换行的问题）
            moveNode.textContent
                ? editor.selection.moveCursor(moveNode)
                : editor.selection.moveCursor(moveNode, 0);
            // 即时更新btn状态
            this.tryChangeActive();
            // 防止最后一行无法跳出
            dom_core_1.default(const_1.EMPTY_P).insertAfter($quote);
            return;
        }
        if (isSelectEmpty) {
            // 需要将选区范围折叠起来
            editor.selection.collapseRange();
            editor.selection.restoreSelection();
        }
    };
    /**
     * 尝试修改菜单激活状态
     */
    Quote.prototype.tryChangeActive = function () {
        var _a;
        var editor = this.editor;
        var cmdValue = (_a = editor.selection.getSelectionRangeTopNodes()[0]) === null || _a === void 0 ? void 0 : _a.getNodeName();
        if (cmdValue === 'BLOCKQUOTE') {
            this.active();
        }
        else {
            this.unActive();
        }
    };
    /**
     * 获取包裹在最外层的节点(防止内部嵌入多个样式)
     * @param selectionElem 选中的节点
     * @returns {string} 最终要处理的节点名称
     */
    Quote.prototype.getTopNodeName = function () {
        var editor = this.editor;
        var $topNodeElem = editor.selection.getSelectionRangeTopNodes()[0];
        var nodeName = $topNodeElem === null || $topNodeElem === void 0 ? void 0 : $topNodeElem.getNodeName();
        return nodeName;
    };
    /**
     * 删除选中的元素
     * @param selectElem 选中的元素节点数组
     */
    Quote.prototype.delSelectNode = function (selectElem) {
        selectElem.forEach(function (node) {
            node.remove();
        });
    };
    return Quote;
}(BtnMenu_1.default));
exports.default = Quote;
//# sourceMappingURL=index.js.map