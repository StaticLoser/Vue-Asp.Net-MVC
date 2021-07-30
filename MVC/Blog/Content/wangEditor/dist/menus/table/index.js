"use strict";
/**
 * @description 创建table
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PanelMenu_1 = tslib_1.__importDefault(require("../menu-constructors/PanelMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var create_panel_conf_1 = tslib_1.__importDefault(require("./create-panel-conf"));
var Panel_1 = tslib_1.__importDefault(require("../menu-constructors/Panel"));
var index_1 = tslib_1.__importDefault(require("./bind-event/index"));
var Table = /** @class */ (function (_super) {
    tslib_1.__extends(Table, _super);
    function Table(editor) {
        var _this = this;
        var $elem = dom_core_1.default('<div class="w-e-menu" data-title="表格"><i class="w-e-icon-table2"></i></div>');
        _this = _super.call(this, $elem, editor) || this;
        // 绑定事件
        index_1.default(editor);
        return _this;
    }
    /**
     * 菜单点击事件
     */
    Table.prototype.clickHandler = function () {
        this.createPanel();
    };
    /**
     * 创建 panel
     */
    Table.prototype.createPanel = function () {
        var conf = create_panel_conf_1.default(this.editor);
        var panel = new Panel_1.default(this, conf);
        panel.create();
    };
    /**
     * 尝试修改菜单 active 状态
     */
    Table.prototype.tryChangeActive = function () { };
    return Table;
}(PanelMenu_1.default));
exports.default = Table;
//# sourceMappingURL=index.js.map