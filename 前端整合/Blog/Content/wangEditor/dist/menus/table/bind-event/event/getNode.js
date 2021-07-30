"use strict";
/**
 * @description 获取dom节点
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../../utils/dom-core"));
var getNode = /** @class */ (function () {
    function getNode(editor) {
        this.editor = editor;
    }
    /**
     * 获取焦点所在行
     * @param $node 当前table
     */
    getNode.prototype.getRowNode = function ($node) {
        var _a;
        var DOM = dom_core_1.default($node).elems[0];
        if (!DOM.parentNode) {
            return DOM;
        }
        DOM = (_a = dom_core_1.default(DOM).parentUntil('TR', DOM)) === null || _a === void 0 ? void 0 : _a.elems[0];
        return DOM;
    };
    /**
     * 获取当前行的下标
     * @param $node 当前table
     * @param $dmo 当前行节点
     */
    getNode.prototype.getCurrentRowIndex = function ($node, $dom) {
        var _index = 0;
        var $nodeChild = $node.children[0];
        //粘贴的table 最后一个节点才是tbody
        if ($nodeChild.nodeName === 'COLGROUP') {
            $nodeChild = $node.children[$node.children.length - 1];
        }
        Array.from($nodeChild.children).forEach(function (item, index) {
            item === $dom ? (_index = index) : '';
        });
        return _index;
    };
    /**
     * 获取当前列的下标
     * @param $node 当前点击元素
     */
    getNode.prototype.getCurrentColIndex = function ($node) {
        var _a;
        //当前行
        var _index = 0;
        //获取当前列 td或th
        var rowDom = dom_core_1.default($node).getNodeName() === 'TD' || dom_core_1.default($node).getNodeName() === 'TH'
            ? $node
            : (_a = dom_core_1.default($node).parentUntil('TD', $node)) === null || _a === void 0 ? void 0 : _a.elems[0];
        var colDom = dom_core_1.default(rowDom).parent();
        Array.from(colDom.elems[0].children).forEach(function (item, index) {
            item === rowDom ? (_index = index) : '';
        });
        return _index;
    };
    /**
     * 返回元素html字符串
     * @param $node
     */
    getNode.prototype.getTableHtml = function ($node) {
        var htmlStr = "<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">" + dom_core_1.default($node).html() + "</table>";
        return htmlStr;
    };
    return getNode;
}());
exports.default = getNode;
//# sourceMappingURL=getNode.js.map