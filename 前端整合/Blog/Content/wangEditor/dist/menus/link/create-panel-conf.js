"use strict";
/**
 * @description link 菜单 panel tab 配置
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../utils/util");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var is_active_1 = tslib_1.__importDefault(require("./is-active"));
var util_2 = require("./util");
function default_1(editor, text, link) {
    // panel 中需要用到的id
    var inputLinkId = util_1.getRandom('input-link');
    var inputTextId = util_1.getRandom('input-text');
    var btnOkId = util_1.getRandom('btn-ok');
    var btnDelId = util_1.getRandom('btn-del');
    // 是否显示“取消链接”
    var delBtnDisplay = is_active_1.default(editor) ? 'inline-block' : 'none';
    var $selectedLink;
    /**
     * 选中整个链接元素
     */
    function selectLinkElem() {
        if (!is_active_1.default(editor))
            return;
        var $linkElem = editor.selection.getSelectionContainerElem();
        if (!$linkElem)
            return;
        editor.selection.createRangeByElem($linkElem);
        editor.selection.restoreSelection();
        $selectedLink = $linkElem; // 赋值给函数内全局变量
    }
    /**
     * 插入链接
     * @param text 文字
     * @param link 链接
     */
    function insertLink(text, link) {
        if (is_active_1.default(editor)) {
            // 选区处于链接中，则选中整个菜单，再执行 insertHTML
            selectLinkElem();
            editor.cmd.do('insertHTML', "<a href=\"" + link + "\" target=\"_blank\">" + text + "</a>");
        }
        else {
            // 选区未处于链接中，直接插入即可
            editor.cmd.do('insertHTML', "<a href=\"" + link + "\" target=\"_blank\">" + text + "</a>");
        }
    }
    /**
     * 取消链接
     */
    function delLink() {
        if (!is_active_1.default(editor)) {
            return;
        }
        // 选中整个链接
        selectLinkElem();
        // 用文本替换链接
        var selectionText = $selectedLink.text();
        editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>');
    }
    /**
     * 校验链接是否合法
     * @param link 链接
     */
    function checkLink(text, link) {
        //查看开发者自定义配置的返回值
        var check = editor.config.linkCheck(text, link);
        if (check === undefined) {
            //用户未能通过开发者的校验，且开发者不希望编辑器提示用户
        }
        else if (check === true) {
            //用户通过了开发者的校验
            return true;
        }
        else {
            //用户未能通过开发者的校验，开发者希望我们提示这一字符串
            editor.config.customAlert(check, 'warning');
        }
        return false;
    }
    var conf = {
        width: 300,
        height: 0,
        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: editor.i18next.t('menus.panelMenus.link.链接'),
                // 模板
                tpl: "<div>\n                        <input\n                            id=\"" + inputTextId + "\"\n                            type=\"text\"\n                            class=\"block\"\n                            value=\"" + text + "\"\n                            placeholder=\"" + editor.i18next.t('menus.panelMenus.link.链接文字') + "\"/>\n                        </td>\n                        <input\n                            id=\"" + inputLinkId + "\"\n                            type=\"text\"\n                            class=\"block\"\n                            value=\"" + link + "\"\n                            placeholder=\"" + editor.i18next.t('如') + " https://...\"/>\n                        </td>\n                        <div class=\"w-e-button-container\">\n                            <button type=\"button\" id=\"" + btnOkId + "\" class=\"right\">\n                                " + editor.i18next.t('插入') + "\n                            </button>\n                            <button type=\"button\" id=\"" + btnDelId + "\" class=\"gray right\" style=\"display:" + delBtnDisplay + "\">\n                                " + editor.i18next.t('menus.panelMenus.link.取消链接') + "\n                            </button>\n                        </div>\n                    </div>",
                // 事件绑定
                events: [
                    // 插入链接
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: function () {
                            var _a, _b;
                            // 获取选取
                            editor.selection.restoreSelection();
                            var topNode = editor.selection
                                .getSelectionRangeTopNodes()[0]
                                .getNode();
                            var selection = window.getSelection();
                            // 执行插入链接
                            var $link = dom_core_1.default('#' + inputLinkId);
                            var $text = dom_core_1.default('#' + inputTextId);
                            var link = $link.val().trim();
                            var text = $text.val().trim();
                            var html = '';
                            if (selection && !(selection === null || selection === void 0 ? void 0 : selection.isCollapsed))
                                html = (_a = util_2.insertHtml(selection, topNode)) === null || _a === void 0 ? void 0 : _a.trim();
                            // 去除html的tag标签
                            var htmlText = html === null || html === void 0 ? void 0 : html.replace(/<.*?>/g, '');
                            var htmlTextLen = (_b = htmlText === null || htmlText === void 0 ? void 0 : htmlText.length) !== null && _b !== void 0 ? _b : 0;
                            // 当input中的text的长度大于等于选区的文字时
                            // 需要判断两者相同的长度的text内容是否相同
                            // 相同则只需把多余的部分添加上去即可，否则使用input中的内容
                            if (htmlTextLen <= text.length) {
                                var startText = text.substring(0, htmlTextLen);
                                var endText = text.substring(htmlTextLen);
                                if (htmlText === startText) {
                                    text = html + endText;
                                }
                            }
                            // 链接为空，则不插入
                            if (!link)
                                return;
                            // 文本为空，则用链接代替
                            if (!text)
                                text = link;
                            // 校验链接是否满足用户的规则，若不满足则不插入
                            if (!checkLink(text, link))
                                return;
                            insertLink(text, link);
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true;
                        },
                    },
                    // 取消链接
                    {
                        selector: '#' + btnDelId,
                        type: 'click',
                        fn: function () {
                            // 执行取消链接
                            delLink();
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true;
                        },
                    },
                ],
            },
        ],
    };
    return conf;
}
exports.default = default_1;
//# sourceMappingURL=create-panel-conf.js.map