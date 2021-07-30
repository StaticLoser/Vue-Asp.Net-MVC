"use strict";
/**
 * @description 入口文件
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("./assets/style/common.less");
require("./assets/style/icon.less");
require("./assets/style/menus.less");
require("./assets/style/text.less");
require("./assets/style/panel.less");
require("./assets/style/droplist.less");
require("./utils/polyfill");
var index_1 = tslib_1.__importDefault(require("./editor/index"));
tslib_1.__exportStar(require("./menus/menu-constructors/index"), exports);
// 检验是否浏览器环境
try {
    document;
}
catch (ex) {
    throw new Error('请在浏览器环境下运行');
}
exports.default = index_1.default;
//# sourceMappingURL=wangEditor.js.map