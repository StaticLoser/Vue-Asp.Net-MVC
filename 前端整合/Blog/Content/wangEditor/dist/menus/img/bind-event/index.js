"use strict";
/**
 * @description 绑定图片的事件
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var paste_img_1 = tslib_1.__importDefault(require("./paste-img"));
var drop_img_1 = tslib_1.__importDefault(require("./drop-img"));
var drag_size_1 = tslib_1.__importDefault(require("./drag-size"));
var tooltip_event_1 = tslib_1.__importDefault(require("./tooltip-event"));
/**
 * 绑定事件
 * @param editor 编辑器实例
 */
function bindEvent(editor) {
    // 粘贴图片
    paste_img_1.default(editor);
    // 拖拽图片
    drop_img_1.default(editor);
    // 可再扩展其他事件...如图片 tooltip 等
    // 拖拽图片尺寸
    drag_size_1.default(editor);
    //Tooltip
    tooltip_event_1.default(editor);
}
exports.default = bindEvent;
//# sourceMappingURL=index.js.map