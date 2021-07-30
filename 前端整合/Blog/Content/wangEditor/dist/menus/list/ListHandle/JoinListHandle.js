"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var ListHandle_1 = require("./ListHandle");
var utils_1 = require("../utils");
var JoinListHandle = /** @class */ (function (_super) {
    tslib_1.__extends(JoinListHandle, _super);
    function JoinListHandle(options) {
        return _super.call(this, options) || this;
    }
    JoinListHandle.prototype.exec = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var _h = this.options, editor = _h.editor, listType = _h.listType, listTarget = _h.listTarget, $startElem = _h.$startElem, $endElem = _h.$endElem;
        // 容器 - HTML 文档片段
        var $containerFragment;
        // 获取选中的段落
        var $nodes = editor.selection.getSelectionRangeTopNodes();
        // 获取开始段落和结束段落 标签名
        var startNodeName = $startElem === null || $startElem === void 0 ? void 0 : $startElem.getNodeName();
        var endNodeName = $endElem === null || $endElem === void 0 ? void 0 : $endElem.getNodeName();
        // =====================================
        // 开头结尾都是序列的情况下
        // 开头序列 和 结尾序列的标签名一致的时候
        // =====================================
        if (startNodeName === endNodeName) {
            // =====================================
            // 开头序列 和 结尾序列 中间还有其他的段落的时候
            // =====================================
            if ($nodes.length > 2) {
                // 弹出 开头 和 结尾
                $nodes.shift();
                $nodes.pop();
                // 把中间部分的节点元素转换成 li 元素并添加到文档片段后删除
                $containerFragment = utils_1.createElementFragment(utils_1.filterSelectionNodes($nodes), // 过滤 $nodes 获取到符合要求的选中元素节点
                utils_1.createDocumentFragment() // 创建 文档片段
                );
                // =====================================
                // 由于开头序列 和 结尾序列的标签名一样，所以只判断了开头序列的
                // 当开头序列的标签名和按钮类型 一致 的时候
                // 代表着当前是一个 设置序列 的操作
                // =====================================
                if (startNodeName === listType) {
                    // 把结束序列的 li 元素添加到 文档片段中
                    (_a = $endElem.children()) === null || _a === void 0 ? void 0 : _a.forEach(function ($list) {
                        $containerFragment.append($list);
                    });
                    // 下序列全选被掏空了，就卸磨杀驴吧
                    $endElem.remove();
                    // 在开始序列中添加 文档片段
                    this.selectionRangeElem.set($containerFragment);
                    $startElem.elems[0].append($containerFragment);
                }
                // =====================================
                // 由于开头序列 和 结尾序列的标签名一样，所以只判断了开头序列的
                // 当开头序列的标签名和按钮类型 不一致 的时候
                // 代表着当前是一个 转换序列 的操作
                // =====================================
                else {
                    // 创建 开始序列和结束序列的文档片段
                    var $startFragment = document.createDocumentFragment();
                    var $endFragment_1 = document.createDocumentFragment();
                    // 获取起点元素
                    var $startDom = utils_1.getStartPoint($startElem);
                    // 获取上半序列中的选中内容，并添加到文档片段中
                    while ($startDom.length) {
                        var _element = $startDom.elems[0];
                        $startDom = $startDom.next();
                        $startFragment.append(_element);
                    }
                    // 获取结束元素
                    var $endDom = utils_1.getEndPoint($endElem);
                    // 获取下半序列中选中的内容
                    var domArr = [];
                    while ($endDom.length) {
                        domArr.unshift($endDom.elems[0]);
                        $endDom = $endDom.prev();
                    }
                    // 添加到文档片段中
                    domArr.forEach(function ($node) {
                        $endFragment_1.append($node);
                    });
                    // 合并文档片段
                    var $orderFragment = utils_1.createElement(listTarget);
                    $orderFragment.append($startFragment);
                    $orderFragment.append($containerFragment);
                    $orderFragment.append($endFragment_1);
                    $containerFragment = $orderFragment;
                    // 插入
                    this.selectionRangeElem.set($containerFragment);
                    dom_core_1.default($orderFragment).insertAfter($startElem);
                    // 序列全选被掏空了后，就卸磨杀驴吧
                    !((_b = $startElem.children()) === null || _b === void 0 ? void 0 : _b.length) && $startElem.remove();
                    !((_c = $endElem.children()) === null || _c === void 0 ? void 0 : _c.length) && $endElem.remove();
                }
            }
            // =====================================
            // 开头序列 和 结尾序列 中间没有其他的段落
            // =====================================
            else {
                $nodes.length = 0;
                // 获取起点元素
                var $startDom = utils_1.getStartPoint($startElem);
                // 获取上半序列中的选中内容
                while ($startDom.length) {
                    $nodes.push($startDom);
                    $startDom = $startDom.next();
                }
                // 获取结束元素
                var $endDom = utils_1.getEndPoint($endElem);
                // 获取下半序列中选中的内容
                var domArr = [];
                // 获取下半序列中的选中内容
                while ($endDom.length) {
                    domArr.unshift($endDom);
                    $endDom = $endDom.prev();
                }
                // 融合内容
                $nodes.push.apply($nodes, domArr);
                // =====================================
                // 由于开头序列 和 结尾序列的标签名一样，所以只判断了开头序列的
                // 当开头序列的标签名和按钮类型 一致 的时候
                // 代表着当前是一个 取消序列 的操作
                // =====================================
                if (startNodeName === listType) {
                    // 创建 文档片段
                    // 把 li 转换为 p 标签
                    $containerFragment = utils_1.createElementFragment($nodes, utils_1.createDocumentFragment(), 'p');
                    // 插入到 endElem 前
                    this.selectionRangeElem.set($containerFragment);
                    utils_1.insertBefore($startElem, $containerFragment, $endElem.elems[0]);
                }
                // =====================================
                // 由于开头序列 和 结尾序列的标签名一样，所以只判断了开头序列的
                // 当开头序列的标签名和按钮类型 不一致 的时候
                // 代表着当前是一个 设置序列 的操作
                // =====================================
                else {
                    // 创建 序列元素
                    $containerFragment = utils_1.createElement(listTarget);
                    // li 元素添加到 序列元素 中
                    $nodes.forEach(function ($list) {
                        $containerFragment.append($list.elems[0]);
                    });
                    // 插入到 startElem 之后
                    this.selectionRangeElem.set($containerFragment);
                    dom_core_1.default($containerFragment).insertAfter($startElem);
                }
                // 序列全选被掏空了后，就卸磨杀驴吧
                !((_d = $startElem.children()) === null || _d === void 0 ? void 0 : _d.length) && $endElem.remove();
                !((_e = $endElem.children()) === null || _e === void 0 ? void 0 : _e.length) && $endElem.remove();
            }
        }
        // =====================================
        // 由于开头序列 和 结尾序列的标签名不一样
        // =====================================
        else {
            // 下序列元素数组
            var lowerListElems = [];
            // 获取结束元素
            var $endDom = utils_1.getEndPoint($endElem);
            // 获取下半序列中选中的内容
            while ($endDom.length) {
                lowerListElems.unshift($endDom);
                $endDom = $endDom.prev();
            }
            // 上序列元素数组
            var upperListElems = [];
            // 获取起点元素
            var $startDom = utils_1.getStartPoint($startElem);
            // 获取上半序列中的选中内容，并添加到文档片段中
            while ($startDom.length) {
                upperListElems.push($startDom);
                $startDom = $startDom.next();
            }
            // 创建 文档片段
            $containerFragment = utils_1.createDocumentFragment();
            // 弹出开头和结尾的序列
            $nodes.shift();
            $nodes.pop();
            // 把头部序列的内容添加到文档片段当中
            upperListElems.forEach(function ($list) { return $containerFragment.append($list.elems[0]); });
            // 生成 li 标签，并且添加到 文档片段中，删除无用节点
            $containerFragment = utils_1.createElementFragment(utils_1.filterSelectionNodes($nodes), // 序列中间的数据 - 进行数据过滤
            $containerFragment);
            // 把尾部序列的内容添加到文档片段当中
            lowerListElems.forEach(function ($list) { return $containerFragment.append($list.elems[0]); });
            // 记录
            this.selectionRangeElem.set($containerFragment);
            // =====================================
            // 开头序列 和 设置序列类型相同
            // =====================================
            if (startNodeName === listType) {
                // 插入到 开始序列的尾部(作为子元素)
                $startElem.elems[0].append($containerFragment);
                // 序列全选被掏空了后，就卸磨杀驴吧
                !((_f = $endElem.children()) === null || _f === void 0 ? void 0 : _f.length) && $endElem.remove();
            }
            // =====================================
            // 结尾序列 和 设置序列类型相同
            // =====================================
            else {
                // 插入到结束序列的顶部(作为子元素)
                if ((_g = $endElem.children()) === null || _g === void 0 ? void 0 : _g.length) {
                    var $endElemChild = $endElem.children();
                    utils_1.insertBefore($endElemChild, $containerFragment, $endElemChild.elems[0]);
                }
                else {
                    $endElem.elems[0].append($containerFragment);
                }
            }
        }
    };
    return JoinListHandle;
}(ListHandle_1.ListHandle));
exports.default = JoinListHandle;
//# sourceMappingURL=JoinListHandle.js.map