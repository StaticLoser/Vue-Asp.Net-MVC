"use strict";
/**
 * @description 绑定视频的事件
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tooltip_event_1 = tslib_1.__importDefault(require("./tooltip-event"));
var keyboard_1 = tslib_1.__importDefault(require("./keyboard"));
/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor) {
    //Tooltip
    tooltip_event_1.default(editor);
    keyboard_1.default(editor);
}
exports.default = bindEvent;
//# sourceMappingURL=index.js.map