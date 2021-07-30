"use strict";
/**
 * @description 编辑器配置
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var menus_1 = tslib_1.__importDefault(require("./menus"));
var events_1 = tslib_1.__importDefault(require("./events"));
var style_1 = tslib_1.__importDefault(require("./style"));
var paste_1 = tslib_1.__importDefault(require("./paste"));
var cmd_1 = tslib_1.__importDefault(require("./cmd"));
var image_1 = tslib_1.__importDefault(require("./image"));
var text_1 = tslib_1.__importDefault(require("./text"));
var lang_1 = tslib_1.__importDefault(require("./lang"));
var history_1 = tslib_1.__importDefault(require("./history"));
var video_1 = tslib_1.__importDefault(require("./video"));
// 合并所有的配置信息
var defaultConfig = Object.assign({}, menus_1.default, events_1.default, style_1.default, cmd_1.default, paste_1.default, image_1.default, text_1.default, lang_1.default, history_1.default, video_1.default, 
//链接校验的配置函数
{
    linkCheck: function (text, link) {
        return true;
    },
});
exports.default = defaultConfig;
//# sourceMappingURL=index.js.map