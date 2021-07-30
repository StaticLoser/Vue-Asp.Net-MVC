"use strict";
/**
 * @description 获取子元素的 JSON 格式数据
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../utils/util");
var dom_core_1 = tslib_1.__importDefault(require("../utils/dom-core"));
/**
 * 获取子元素的 JSON 格式数据
 * @param $elem DOM 节点
 */
function getChildrenJSON($elem) {
    var result = []; // 存储结果
    var $children = $elem.childNodes() || []; // 注意 childNodes() 可以获取文本节点
    $children.forEach(function (curElem) {
        var elemResult;
        var nodeType = curElem.nodeType;
        // 文本节点
        if (nodeType === 3) {
            elemResult = curElem.textContent || '';
            elemResult = util_1.replaceHtmlSymbol(elemResult);
        }
        // 普通 DOM 节点
        if (nodeType === 1) {
            elemResult = {};
            elemResult = elemResult;
            // tag
            elemResult.tag = curElem.nodeName.toLowerCase();
            // attr
            var attrData = [];
            var attrList = curElem.attributes;
            var attrListLength = attrList.length || 0;
            for (var i = 0; i < attrListLength; i++) {
                var attr = attrList[i];
                attrData.push({
                    name: attr.name,
                    value: attr.value,
                });
            }
            elemResult.attrs = attrData;
            // children（递归）
            elemResult.children = getChildrenJSON(dom_core_1.default(curElem));
        }
        if (elemResult) {
            result.push(elemResult);
        }
    });
    return result;
}
exports.default = getChildrenJSON;
//# sourceMappingURL=getChildrenJSON.js.map