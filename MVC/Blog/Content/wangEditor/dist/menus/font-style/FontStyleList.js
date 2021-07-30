"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @description 字体 class
 * @author dyl
 */
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
/**
 * 封装的一个字体菜单列表数据的组装对象,
 * 原因是因为在constructor函数中,直接执行此流程,会让代码量看起来较多,
 * 如果要在constructor调用外部函数,个人目前发现会有错误提示,
 * 因此,想着顺便研究实践下ts,遍创建了这样一个类
 */
var FontStyleList = /** @class */ (function () {
    function FontStyleList(list) {
        var _this = this;
        this.itemList = [];
        list.forEach(function (fontValue) {
            // fontValue 2种情况一种是string类型的直接value等同于font-family
            // Object类型value为font-family name为ui视图呈现
            var fontFamily = typeof fontValue === 'string' ? fontValue : fontValue.value;
            var fontName = typeof fontValue === 'string' ? fontValue : fontValue.name;
            _this.itemList.push({
                $elem: dom_core_1.default("<p style=\"font-family:'" + fontFamily + "'\">" + fontName + "</p>"),
                value: fontName,
            });
        });
    }
    FontStyleList.prototype.getItemList = function () {
        return this.itemList;
    };
    return FontStyleList;
}());
exports.default = FontStyleList;
//# sourceMappingURL=FontStyleList.js.map