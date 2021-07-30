"use strict";
/**
 * @description 绑定点击事件
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tooltip_event_1 = tslib_1.__importDefault(require("./tooltip-event"));
var table_event_1 = require("./table-event");
/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor) {
    //Tooltip
    tooltip_event_1.default(editor);
    table_event_1.bindEventKeyboardEvent(editor);
    table_event_1.bindClickEvent(editor);
}
exports.default = bindEvent;
//# sourceMappingURL=index.js.map