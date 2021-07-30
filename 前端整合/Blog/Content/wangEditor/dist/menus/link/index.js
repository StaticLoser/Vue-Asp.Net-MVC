"use strict";
/**
 * @description 链接 菜单
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PanelMenu_1 = tslib_1.__importDefault(require("../menu-constructors/PanelMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var create_panel_conf_1 = tslib_1.__importDefault(require("./create-panel-conf"));
var is_active_1 = tslib_1.__importDefault(require("./is-active"));
var Panel_1 = tslib_1.__importDefault(require("../menu-constructors/Panel"));
var index_1 = tslib_1.__importDefault(require("./bind-event/index"));
var Link = /** @class */ (function (_super) {
    tslib_1.__extends(Link, _super);
    function Link(editor) {
        var _this = this;
        var $elem = dom_core_1.default('<div class="w-e-menu" data-title="链接"><i class="w-e-icon-link"></i></div>');
        _this = _super.call(this, $elem, editor) || this;
        // 绑定事件，如点击链接时，可以查看链接
        index_1.default(editor);
        return _this;
    }
    /**
     * 菜单点击事件
     */
    Link.prototype.clickHandler = function () {
        var editor = this.editor;
        var $linkElem;
        if (this.isActive) {
            // 菜单被激活，说明选区在链接里
            $linkElem = editor.selection.getSelectionContainerElem();
            if (!$linkElem) {
                return;
            }
            // 弹出 panel
            this.createPanel($linkElem.text(), $linkElem.attr('href'));
        }
        else {
            // 菜单未被激活，说明选区不在链接里
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this.createPanel('', '');
            }
            else {
                // 选中内容了
                this.createPanel(editor.selection.getSelectionText(), '');
            }
        }
    };
    /**
     * 创建 panel
     * @param text 文本
     * @param link 链接
     */
    Link.prototype.createPanel = function (text, link) {
        var conf = create_panel_conf_1.default(this.editor, text, link);
        var panel = new Panel_1.default(this, conf);
        panel.create();
    };
    /**
     * 尝试修改菜单 active 状态
     */
    Link.prototype.tryChangeActive = function () {
        var editor = this.editor;
        if (is_active_1.default(editor)) {
            this.active();
        }
        else {
            this.unActive();
        }
    };
    return Link;
}(PanelMenu_1.default));
exports.default = Link;
//# sourceMappingURL=index.js.map