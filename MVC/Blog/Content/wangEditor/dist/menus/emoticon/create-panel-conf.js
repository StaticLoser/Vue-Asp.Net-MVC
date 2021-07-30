"use strict";
/**
 * @description  表情菜单 panel配置
 * @author liuwei
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
function default_1(editor) {
    // 声明emotions数据结构
    var emotions = editor.config.emotions;
    /* tabs配置项 ==================================================================*/
    // 生成表情结构 TODO jele type类型待优化
    function GenerateExpressionStructure(ele) {
        // 返回为一个数组对象
        var res = [];
        // 如果type是image类型则生成一个img标签
        if (ele.type == 'image') {
            res = ele.content.map(function (con) {
                if (typeof con == 'string')
                    return '';
                return "<span  title=\"" + con.alt + "\">\n                    <img class=\"eleImg\" data-emoji=\"" + con.alt + "\" style src=\"" + con.src + "\" alt=\"[" + con.alt + "]\">\n                </span>";
            });
            res = res.filter(function (s) { return s !== ''; });
        }
        //否则直接当内容处理
        else {
            res = ele.content.map(function (con) {
                return "<span class=\"eleImg\" title=\"" + con + "\">" + con + "</span>";
            });
        }
        return res.join('').replace(/&nbsp;/g, '');
    }
    var tabsConf = emotions.map(function (ele) {
        return {
            title: editor.i18next.t("menus.panelMenus.emoticon." + ele.title),
            // 判断type类型如果是image则以img的形式插入否则以内容
            tpl: "<div>" + GenerateExpressionStructure(ele) + "</div>",
            events: [
                {
                    selector: '.eleImg',
                    type: 'click',
                    fn: function (e) {
                        // e为事件对象
                        var $target = dom_core_1.default(e.target);
                        var nodeName = $target.getNodeName();
                        var insertHtml;
                        if (nodeName === 'IMG') {
                            // 插入图片
                            insertHtml = $target.parent().html().trim();
                        }
                        else {
                            // 插入 emoji
                            insertHtml = '<span>' + $target.html() + '</span>';
                        }
                        editor.cmd.do('insertHTML', insertHtml);
                        // 示函数执行结束之后关闭 panel
                        return true;
                    },
                },
            ],
        };
    });
    /* tabs配置项 =================================================================end*/
    // 最终的配置 -----------------------------------------
    var conf = {
        width: 300,
        height: 230,
        tabs: tabsConf,
    };
    return conf;
}
exports.default = default_1;
//# sourceMappingURL=create-panel-conf.js.map