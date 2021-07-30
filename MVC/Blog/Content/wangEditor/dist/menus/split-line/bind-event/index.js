"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tooltip_event_1 = tslib_1.__importDefault(require("./tooltip-event"));
/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor) {
    // 分割线的 tooltip 事件
    tooltip_event_1.default(editor);
}
exports.default = bindEvent;
//# sourceMappingURL=index.js.map