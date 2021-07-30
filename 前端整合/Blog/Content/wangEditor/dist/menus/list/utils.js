"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElementFragment = exports.createDocumentFragment = exports.createElement = exports.insertBefore = exports.getEndPoint = exports.getStartPoint = exports.updateRange = exports.filterSelectionNodes = void 0;
var tslib_1 = require("tslib");
var _1 = require(".");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
/**
 * 过滤 选择的 node 节点
 * @returns { DomElement[] } DomElement[]
 */
function filterSelectionNodes($nodes) {
    var $listHtml = [];
    $nodes.forEach(function ($node) {
        var targerName = $node.getNodeName();
        if (targerName !== _1.ListType.OrderedList && targerName !== _1.ListType.UnorderedList) {
            // 非序列
            $listHtml.push($node);
        }
        else {
            // 序列
            if ($node.prior) {
                $listHtml.push($node.prior);
            }
            else {
                var $children = $node.children();
                $children === null || $children === void 0 ? void 0 : $children.forEach(function ($li) {
                    $listHtml.push(dom_core_1.default($li));
                });
            }
        }
    });
    return $listHtml;
}
exports.filterSelectionNodes = filterSelectionNodes;
/**
 * 更新选区
 * @param $node
 */
function updateRange(editor, $node, collapsed) {
    var selection = editor.selection;
    var range = document.createRange();
    // ===============================
    // length 大于 1
    // 代表着转换是一个文档节点多段落
    // ===============================
    if ($node.length > 1) {
        range.setStart($node.elems[0], 0);
        range.setEnd($node.elems[$node.length - 1], $node.elems[$node.length - 1].childNodes.length);
    }
    // ===============================
    // 序列节点 或 单段落
    // ===============================
    else {
        range.selectNodeContents($node.elems[0]);
    }
    // ===============================
    // collapsed 为 true 代表是光标
    // ===============================
    collapsed && range.collapse(false);
    selection.saveRange(range);
    selection.restoreSelection();
}
exports.updateRange = updateRange;
/**
 * 获取起点元素
 * @param $startElem 开始序列节点
 */
function getStartPoint($startElem) {
    var _a;
    return $startElem.prior
        ? $startElem.prior // 有 prior 代表不是全选序列
        : dom_core_1.default((_a = $startElem.children()) === null || _a === void 0 ? void 0 : _a.elems[0]); // 没有则代表全选序列
}
exports.getStartPoint = getStartPoint;
/**
 * 获取结束元素
 * @param $endElem 结束序列节点
 */
function getEndPoint($endElem) {
    var _a;
    return $endElem.prior
        ? $endElem.prior // 有 prior 代表不是全选序列
        : dom_core_1.default((_a = $endElem.children()) === null || _a === void 0 ? void 0 : _a.last().elems[0]); // 没有则代表全选序列
}
exports.getEndPoint = getEndPoint;
/**
 * 在您指定节点的已有子节点之前插入新的子节点。
 * @param { DomElement } $node 指定节点
 * @param { ContainerFragment } newNode 插入的新子节点
 * @param { Node | null } existingNode 指定子节点
 */
function insertBefore($node, newNode, existingNode) {
    if (existingNode === void 0) { existingNode = null; }
    $node.parent().elems[0].insertBefore(newNode, existingNode);
}
exports.insertBefore = insertBefore;
/**
 * 创建指定的 element 对象
 */
function createElement(target) {
    return document.createElement(target);
}
exports.createElement = createElement;
/**
 * 创建文档片段
 */
function createDocumentFragment() {
    return document.createDocumentFragment();
}
exports.createDocumentFragment = createDocumentFragment;
/**
 * 生成 li 标签的元素，并返回 $fragment 文档片段
 * @param { DomElement[] } $nodes 需要转换成 li 的 dom 元素数组
 * @param { ContainerFragment } $fragment 用于存储生成后 li 元素的文档片段
 */
function createElementFragment($nodes, $fragment, tag) {
    if (tag === void 0) { tag = 'li'; }
    $nodes.forEach(function ($node) {
        var $list = createElement(tag);
        $list.innerHTML = $node.html();
        $fragment.appendChild($list);
        $node.remove();
    });
    return $fragment;
}
exports.createElementFragment = createElementFragment;
//# sourceMappingURL=utils.js.map