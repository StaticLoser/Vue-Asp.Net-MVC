"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
/**
 * 创建一个blockquote元素节点
 * @param editor 编辑器实例
 */
function createQuote($childElem) {
    var $targetElem = dom_core_1.default("<blockquote></blockquote>");
    $childElem.forEach(function (node) {
        $targetElem.append(node.clone(true));
    });
    return $targetElem;
}
exports.default = createQuote;
//# sourceMappingURL=create-quote-node.js.map