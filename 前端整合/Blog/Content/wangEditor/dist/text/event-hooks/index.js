"use strict";
/**
 * @description Text 事件钩子函数。Text 公共的，不是某个菜单独有的
 * @wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var enter_to_create_p_1 = tslib_1.__importDefault(require("./enter-to-create-p"));
var del_to_keep_p_1 = tslib_1.__importStar(require("./del-to-keep-p"));
var tab_to_space_1 = tslib_1.__importDefault(require("./tab-to-space"));
var paste_text_html_1 = tslib_1.__importDefault(require("./paste-text-html"));
var img_click_active_1 = tslib_1.__importDefault(require("./img-click-active"));
/**
 * 初始化 text 事件钩子函数
 * @param text text 实例
 */
function initTextHooks(text) {
    var editor = text.editor;
    var eventHooks = text.eventHooks;
    // 回车时，保证生成的是 <p> 标签
    enter_to_create_p_1.default(editor, eventHooks.enterUpEvents, eventHooks.enterDownEvents);
    // 删除时，保留 EMPTY_P
    del_to_keep_p_1.default(editor, eventHooks.deleteUpEvents, eventHooks.deleteDownEvents);
    // 剪切时, 保留p
    del_to_keep_p_1.cutToKeepP(editor, eventHooks.keyupEvents);
    // tab 转换为空格
    tab_to_space_1.default(editor, eventHooks.tabDownEvents);
    // 粘贴 text html
    paste_text_html_1.default(editor, eventHooks.pasteEvents);
    // img click active
    img_click_active_1.default(editor, eventHooks.imgClickEvents);
}
exports.default = initTextHooks;
//# sourceMappingURL=index.js.map