"use strict";
/**
 * @description 减少缩进
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
function decreaseIndentStyle($node, options) {
    var $elem = $node.elems[0];
    if ($elem.style['paddingLeft'] !== '') {
        var oldPL = $elem.style['paddingLeft'];
        var oldVal = oldPL.slice(0, oldPL.length - options.unit.length);
        var newVal = Number(oldVal) - options.value;
        if (newVal > 0) {
            $node.css('padding-left', "" + newVal + options.unit);
        }
        else {
            $node.css('padding-left', '');
        }
    }
}
exports.default = decreaseIndentStyle;
//# sourceMappingURL=decrease-indent-style.js.map