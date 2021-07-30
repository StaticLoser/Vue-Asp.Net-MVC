"use strict";
/**
 * @description 事件配置
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../utils/const");
/**
 * 提示信息
 * @param alertInfo alert info
 * @param alertType 错误提示类型
 * @param debugInfo debug info
 */
function customAlert(alertInfo, alertType, debugInfo) {
    window.alert(alertInfo);
    if (debugInfo) {
        console.error('wangEditor: ' + debugInfo);
    }
}
exports.default = {
    onchangeTimeout: 200,
    onchange: null,
    onfocus: const_1.EMPTY_FN,
    onblur: const_1.EMPTY_FN,
    onCatalogChange: null,
    customAlert: customAlert,
};
//# sourceMappingURL=events.js.map