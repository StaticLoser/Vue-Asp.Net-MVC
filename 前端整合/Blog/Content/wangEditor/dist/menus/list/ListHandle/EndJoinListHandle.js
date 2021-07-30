"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var ListHandle_1 = require("./ListHandle");
var utils_1 = require("../utils");
var EndJoinListHandle = /** @class */ (function (_super) {
    tslib_1.__extends(EndJoinListHandle, _super);
    function EndJoinListHandle(options) {
        return _super.call(this, options) || this;
    }
    EndJoinListHandle.prototype.exec = function () {
        var _a, _b;
        var _c = this.options, editor = _c.editor, listType = _c.listType, listTarget = _c.listTarget, $endElem = _c.$endElem;
        // 容器 - HTML 文档片段
        var $containerFragment;
        // 获取选中的段落
        var $nodes = editor.selection.getSelectionRangeTopNodes();
        // 获取结束段落标签名
        var endNodeName = $endElem === null || $endElem === void 0 ? void 0 : $endElem.getNodeName();
        // 弹出 结束序列
        $nodes.pop();
        // 下序列元素数组
        var lowerListElems = [];
        // 获取结束元素
        var $endDom = utils_1.getEndPoint($endElem);
        // 获取下半序列中选中的内容
        while ($endDom.length) {
            lowerListElems.unshift($endDom);
            $endDom = $endDom.prev();
        }
        // =====================================
        // 当前序列类型和结束序列的类型 一致
        // 代表当前是一个 融合(把其他段落加入到结束序列中) 的操作
        // =====================================
        if (endNodeName === listType) {
            // 生成 li 元属，并删除原来的 dom 元素
            $containerFragment = utils_1.createElementFragment(utils_1.filterSelectionNodes($nodes), // 过滤元素节点数据
            utils_1.createDocumentFragment() // 创建 文档片段
            );
            lowerListElems.forEach(function ($list) { return $containerFragment.append($list.elems[0]); });
            // 插入到结束序列之前
            this.selectionRangeElem.set($containerFragment);
            if ((_a = $endElem.children()) === null || _a === void 0 ? void 0 : _a.length) {
                var $endElemChild = $endElem.children();
                utils_1.insertBefore($endElemChild, $containerFragment, $endElemChild.elems[0]);
            }
            else {
                $endElem.elems[0].append($containerFragment);
            }
        }
        // =====================================
        // 当前序列类型和结束序列的类型 不一致
        // 代表当前是一个 设置序列 的操作
        // =====================================
        else {
            // 过滤元素节点数据
            var $selectionNodes = utils_1.filterSelectionNodes($nodes);
            // 把下序列的内容添加到过滤元素中
            $selectionNodes.push.apply($selectionNodes, lowerListElems);
            // 生成 li 元素并且添加到序列节点后删除原节点
            $containerFragment = utils_1.createElementFragment($selectionNodes, utils_1.createElement(listTarget) // 创建 序列节点
            );
            // 插入到结束序列之前
            this.selectionRangeElem.set($containerFragment);
            dom_core_1.default($containerFragment).insertBefore($endElem);
            // 序列全选被掏空了后，就卸磨杀驴吧
            !((_b = $endElem.children()) === null || _b === void 0 ? void 0 : _b.length) && $endElem.remove();
        }
    };
    return EndJoinListHandle;
}(ListHandle_1.ListHandle));
exports.default = EndJoinListHandle;
//# sourceMappingURL=EndJoinListHandle.js.map