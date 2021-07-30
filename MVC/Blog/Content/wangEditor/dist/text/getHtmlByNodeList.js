"use strict";
/**
 * @description 从nodeList json格式中遍历生成dom元素
 * @author zhengwenjian
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("./../utils/dom-core"));
function getHtmlByNodeList(nodeList, parent) {
    if (parent === void 0) { parent = document.createElement('div'); }
    // 设置一个父节点存储所有子节点
    var root = parent;
    // 遍历节点JSON
    nodeList.forEach(function (item) {
        var elem;
        // 当为文本节点时
        if (typeof item === 'string') {
            elem = document.createTextNode(item);
        }
        // 当为普通节点时
        if (typeof item === 'object') {
            elem = document.createElement(item.tag);
            item.attrs.forEach(function (attr) {
                dom_core_1.default(elem).attr(attr.name, attr.value);
            });
            // 有子节点时递归将子节点加入当前节点
            if (item.children && item.children.length > 0) {
                getHtmlByNodeList(item.children, elem.getRootNode());
            }
        }
        elem && root.appendChild(elem);
    });
    return dom_core_1.default(root);
}
exports.default = getHtmlByNodeList;
//# sourceMappingURL=getHtmlByNodeList.js.map