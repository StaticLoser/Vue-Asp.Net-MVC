"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var ListHandle_1 = require("./ListHandle");
var utils_1 = require("../utils");
var StartJoinListHandle = /** @class */ (function (_super) {
    tslib_1.__extends(StartJoinListHandle, _super);
    function StartJoinListHandle(options) {
        return _super.call(this, options) || this;
    }
    StartJoinListHandle.prototype.exec = function () {
        var _a;
        var _b = this.options, editor = _b.editor, listType = _b.listType, listTarget = _b.listTarget, $startElem = _b.$startElem;
        // 容器 - HTML 文档片段
        var $containerFragment;
        // 获取选中的段落
        var $nodes = editor.selection.getSelectionRangeTopNodes();
        // 获取开始段落标签名
        var startNodeName = $startElem === null || $startElem === void 0 ? void 0 : $startElem.getNodeName();
        // 弹出 开头序列
        $nodes.shift();
        // 上序列元素数组
        var upperListElems = [];
        // 获取起点元素
        var $startDom = utils_1.getStartPoint($startElem);
        // 获取上半序列中的选中内容，并添加到文档片段中
        while ($startDom.length) {
            upperListElems.push($startDom);
            $startDom = $startDom.next();
        }
        // =====================================
        // 当前序列类型和开头序列的类型 一致
        // 代表当前是一个 融合(把其他段落加入到开头序列中) 的操作
        // =====================================
        if (startNodeName === listType) {
            $containerFragment = utils_1.createDocumentFragment();
            upperListElems.forEach(function ($list) { return $containerFragment.append($list.elems[0]); });
            // 生成 li 元属，并删除
            $containerFragment = utils_1.createElementFragment(utils_1.filterSelectionNodes($nodes), // 过滤元素节点数据
            $containerFragment);
            // 插入到开始序列末尾
            this.selectionRangeElem.set($containerFragment);
            // this.selectionRangeElem.set($startElem.elems[0])
            $startElem.elems[0].append($containerFragment);
        }
        // =====================================
        // 当前序列类型和开头序列的类型 不一致
        // 代表当前是一个 设置序列 的操作
        // =====================================
        else {
            // 创建 序列节点
            $containerFragment = utils_1.createElement(listTarget);
            upperListElems.forEach(function ($list) { return $containerFragment.append($list.elems[0]); });
            // 生成 li 元素，并添加到 序列节点 当中，删除无用节点
            $containerFragment = utils_1.createElementFragment(utils_1.filterSelectionNodes($nodes), // 过滤普通节点
            $containerFragment);
            // 插入到开始元素
            this.selectionRangeElem.set($containerFragment);
            dom_core_1.default($containerFragment).insertAfter($startElem);
            // 序列全选被掏空了后，就卸磨杀驴吧
            !((_a = $startElem.children()) === null || _a === void 0 ? void 0 : _a.length) && $startElem.remove();
        }
    };
    return StartJoinListHandle;
}(ListHandle_1.ListHandle));
exports.default = StartJoinListHandle;
//# sourceMappingURL=StartJoinListHandle.js.map