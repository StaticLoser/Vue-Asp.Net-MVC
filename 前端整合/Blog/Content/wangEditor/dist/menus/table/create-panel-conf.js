"use strict";
/**
 * @description table 菜单 panel tab 配置
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../utils/util");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
require("../../assets/style/create-panel-conf.less");
var create_table_1 = tslib_1.__importDefault(require("./create-table"));
/**
 * 判断一个数值是否为正整数
 * @param { number } n 被验证的值
 */
function isPositiveInteger(n) {
    //是否为正整数
    return n > 0 && Number.isInteger(n);
}
function default_1(editor) {
    var createTable = new create_table_1.default(editor);
    // panel 中需要用到的id
    var colId = util_1.getRandom('w-col-id');
    var rowId = util_1.getRandom('w-row-id');
    var insertBtnId = util_1.getRandom('btn-link');
    var i18nPrefix = 'menus.panelMenus.table.';
    var t = function (text) {
        return editor.i18next.t(text);
    };
    // tabs 配置 -----------------------------------------
    var tabsConf = [
        {
            title: t(i18nPrefix + "\u63D2\u5165\u8868\u683C"),
            tpl: "<div>\n                    <div class=\"w-e-table\">\n                        <span>" + t('创建') + "</span>\n                        <input id=\"" + rowId + "\"  type=\"text\" class=\"w-e-table-input\" value=\"5\"/></td>\n                        <span>" + t(i18nPrefix + "\u884C") + "</span>\n                        <input id=\"" + colId + "\" type=\"text\" class=\"w-e-table-input\" value=\"5\"/></td>\n                        <span>" + (t(i18nPrefix + "\u5217") + t(i18nPrefix + "\u7684") + t(i18nPrefix + "\u8868\u683C")) + "</span>\n                    </div>\n                    <div class=\"w-e-button-container\">\n                        <button type=\"button\" id=\"" + insertBtnId + "\" class=\"right\">" + t('插入') + "</button>\n                    </div>\n                </div>",
            events: [
                {
                    selector: '#' + insertBtnId,
                    type: 'click',
                    fn: function () {
                        var colValue = Number(dom_core_1.default('#' + colId).val());
                        var rowValue = Number(dom_core_1.default('#' + rowId).val());
                        //校验是否传值
                        if (isPositiveInteger(rowValue) && isPositiveInteger(colValue)) {
                            createTable.createAction(rowValue, colValue);
                            return true;
                        }
                        else {
                            editor.config.customAlert('表格行列请输入正整数', 'warning');
                            return false;
                        }
                        // 返回 true 表示函数执行结束之后关闭 panel
                    },
                },
            ],
        },
    ];
    // tabs end
    // 最终的配置 -----------------------------------------
    var conf = {
        width: 330,
        height: 0,
        tabs: [],
    };
    conf.tabs.push(tabsConf[0]);
    return conf;
}
exports.default = default_1;
//# sourceMappingURL=create-panel-conf.js.map