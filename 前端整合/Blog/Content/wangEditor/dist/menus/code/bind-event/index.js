"use strict";
/**
 * @description 绑定链接元素的事件，入口
 * @author lkw
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tooltip_event_1 = tslib_1.__importDefault(require("./tooltip-event"));
var jump_code_block_down_1 = tslib_1.__importDefault(require("./jump-code-block-down"));
/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor) {
    // tooltip 事件
    tooltip_event_1.default(editor);
    // 代码块为最后内容的跳出处理
    jump_code_block_down_1.default(editor);
}
exports.default = bindEvent;
//# sourceMappingURL=index.js.map