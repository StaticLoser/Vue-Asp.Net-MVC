"use strict";
/**
 * @description 对节点 操作 进行封装
 *                  获取当前节点的段落
 *                  根据type判断是增加还是减少缩进
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var increase_indent_style_1 = tslib_1.__importDefault(require("./increase-indent-style"));
var decrease_indent_style_1 = tslib_1.__importDefault(require("./decrease-indent-style"));
var lengthRegex = /^(\d+)(\w+)$/;
var percentRegex = /^(\d+)%$/;
function parseIndentation(editor) {
    var indentation = editor.config.indentation;
    if (typeof indentation === 'string') {
        if (lengthRegex.test(indentation)) {
            var _a = indentation.trim().match(lengthRegex).slice(1, 3), value = _a[0], unit = _a[1];
            return {
                value: Number(value),
                unit: unit,
            };
        }
        else if (percentRegex.test(indentation)) {
            return {
                value: Number(indentation.trim().match(percentRegex)[1]),
                unit: '%',
            };
        }
    }
    else if (indentation.value !== void 0 && indentation.unit) {
        return indentation;
    }
    return {
        value: 2,
        unit: 'em',
    };
}
function operateElement($node, type, editor) {
    var $elem = $node.getNodeTop(editor);
    var reg = /^(P|H[0-9]*)$/;
    if (reg.test($elem.getNodeName())) {
        if (type === 'increase')
            increase_indent_style_1.default($elem, parseIndentation(editor));
        else if (type === 'decrease')
            decrease_indent_style_1.default($elem, parseIndentation(editor));
    }
}
exports.default = operateElement;
//# sourceMappingURL=operate-element.js.map