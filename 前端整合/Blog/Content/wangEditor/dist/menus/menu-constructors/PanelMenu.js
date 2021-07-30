"use strict";
/**
 * @description Modal 菜单 Class
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Menu_1 = tslib_1.__importDefault(require("./Menu"));
var PanelMenu = /** @class */ (function (_super) {
    tslib_1.__extends(PanelMenu, _super);
    function PanelMenu($elem, editor) {
        return _super.call(this, $elem, editor) || this;
    }
    /**
     * 给 menu 设置 panel
     * @param panel panel 实例
     */
    PanelMenu.prototype.setPanel = function (panel) {
        this.panel = panel;
    };
    return PanelMenu;
}(Menu_1.default));
exports.default = PanelMenu;
//# sourceMappingURL=PanelMenu.js.map