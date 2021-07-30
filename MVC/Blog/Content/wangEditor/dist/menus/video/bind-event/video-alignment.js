"use strict";
/**
 * @description 视频布局 事件
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
// 设置布局方式
function setAlignment($node, value) {
    // 设置顶级元素匹配
    var NODENAME = ['P'];
    // 获取匹配得顶级元素
    var topNode = getSelectedTopNode($node, NODENAME);
    // 判断是否存在
    if (topNode) {
        dom_core_1.default(topNode).css('text-align', value);
    }
}
exports.default = setAlignment;
/**
 * 获取选中的元素的顶级元素
 * @params el 选中的元素
 * @params tag 匹配顶级的元素 如 P LI ....
 */
function getSelectedTopNode(el, tag) {
    var _a;
    var parentNode = el.elems[0];
    // 可能出现嵌套的情况，所以一级一级向上找，找到指定得顶级元素
    while (parentNode != null) {
        if (tag.includes(parentNode === null || parentNode === void 0 ? void 0 : parentNode.nodeName)) {
            return parentNode;
        }
        // 兜底 body
        if (((_a = parentNode === null || parentNode === void 0 ? void 0 : parentNode.parentNode) === null || _a === void 0 ? void 0 : _a.nodeName) === 'BODY') {
            return null;
        }
        parentNode = parentNode.parentNode;
    }
    return parentNode;
}
//# sourceMappingURL=video-alignment.js.map