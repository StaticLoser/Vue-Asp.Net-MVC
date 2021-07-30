"use strict";
/**
 * @description 增加缩进
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
function increaseIndentStyle($node, options) {
    var $elem = $node.elems[0];
    if ($elem.style['paddingLeft'] === '') {
        $node.css('padding-left', options.value + options.unit);
    }
    else {
        var oldPL = $elem.style['paddingLeft'];
        var oldVal = oldPL.slice(0, oldPL.length - options.unit.length);
        var newVal = Number(oldVal) + options.value;
        $node.css('padding-left', "" + newVal + options.unit);
    }
}
exports.default = increaseIndentStyle;
//# sourceMappingURL=increase-indent-style.js.map