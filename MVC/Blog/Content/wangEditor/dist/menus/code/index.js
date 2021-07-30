"use strict";
/**
 * @description 代码 菜单
 * @author lkw
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCodeHtml = void 0;
var tslib_1 = require("tslib");
var PanelMenu_1 = tslib_1.__importDefault(require("../menu-constructors/PanelMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var util_1 = require("../../utils/util");
var create_panel_conf_1 = tslib_1.__importDefault(require("./create-panel-conf"));
var is_active_1 = tslib_1.__importDefault(require("./is-active"));
var Panel_1 = tslib_1.__importDefault(require("../menu-constructors/Panel"));
var index_1 = tslib_1.__importDefault(require("./bind-event/index"));
function formatCodeHtml(editor, html) {
    if (!html)
        return html;
    html = deleteHighlightCode(html);
    html = formatEnterCode(html);
    html = util_1.replaceSpecialSymbol(html);
    return html;
    // 格式化换换所产生的code标签
    function formatEnterCode(html) {
        var preArr = html.match(/<pre[\s|\S]+?\/pre>/g);
        if (preArr === null)
            return html;
        preArr.map(function (item) {
            //将连续的code标签换为\n换行
            html = html.replace(item, item.replace(/<\/code><code>/g, '\n').replace(/<br>/g, ''));
        });
        return html;
    }
    // highlight格式化方法
    function deleteHighlightCode(html) {
        // 获取所有hljs文本
        var m = html.match(/<span\sclass="hljs[\s|\S]+?\/span>/gm);
        // 没有代码渲染文本则退出
        // @ts-ignore
        if (!m || !m.length)
            return html;
        // 获取替换文本
        var r = util_1.deepClone(m).map(function (i) {
            i = i.replace(/<span\sclass="hljs[^>]+>/, '');
            return i.replace(/<\/span>/, '');
        });
        // @ts-ignore
        for (var i = 0; i < m.length; i++) {
            html = html.replace(m[i], r[i]);
        }
        return deleteHighlightCode(html);
    }
}
exports.formatCodeHtml = formatCodeHtml;
var Code = /** @class */ (function (_super) {
    tslib_1.__extends(Code, _super);
    function Code(editor) {
        var _this = this;
        var $elem = dom_core_1.default('<div class="w-e-menu" data-title="代码"><i class="w-e-icon-terminal"></i></div>');
        _this = _super.call(this, $elem, editor) || this;
        // 绑定事件，如点击链接时，可以查看链接
        index_1.default(editor);
        return _this;
    }
    /**
     * 插入行内代码
     * @param text
     * @return null
     */
    Code.prototype.insertLineCode = function (text) {
        var editor = this.editor;
        // 行内代码处理
        var $code = dom_core_1.default("<code>" + text + "</code>");
        editor.cmd.do('insertElem', $code);
        editor.selection.createRangeByElem($code, false);
        editor.selection.restoreSelection();
    };
    /**
     * 菜单点击事件
     */
    Code.prototype.clickHandler = function () {
        var editor = this.editor;
        var selectionText = editor.selection.getSelectionText();
        if (this.isActive) {
            return;
        }
        else {
            // 菜单未被激活，说明选区不在链接里
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this.createPanel('', '');
            }
            else {
                // 行内代码处理 选中了非代码内容
                this.insertLineCode(selectionText);
            }
        }
    };
    /**
     * 创建 panel
     * @param text 代码文本
     * @param languageType 代码类型
     */
    Code.prototype.createPanel = function (text, languageType) {
        var conf = create_panel_conf_1.default(this.editor, text, languageType);
        var panel = new Panel_1.default(this, conf);
        panel.create();
    };
    /**
     * 尝试修改菜单 active 状态
     */
    Code.prototype.tryChangeActive = function () {
        var editor = this.editor;
        if (is_active_1.default(editor)) {
            this.active();
        }
        else {
            this.unActive();
        }
    };
    return Code;
}(PanelMenu_1.default));
exports.default = Code;
//# sourceMappingURL=index.js.map