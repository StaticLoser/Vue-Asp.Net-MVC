"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @description 插入表情
 * @author liuwe
 */
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var PanelMenu_1 = tslib_1.__importDefault(require("../menu-constructors/PanelMenu"));
var Panel_1 = tslib_1.__importDefault(require("../menu-constructors/Panel"));
var create_panel_conf_1 = tslib_1.__importDefault(require("./create-panel-conf"));
var Emoticon = /** @class */ (function (_super) {
    tslib_1.__extends(Emoticon, _super);
    function Emoticon(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u8868\u60C5\">\n                <i class=\"w-e-icon-happy\"></i>\n            </div>");
        _this = _super.call(this, $elem, editor) || this;
        return _this;
    }
    /**
     * 创建 panel
     */
    Emoticon.prototype.createPanel = function () {
        var conf = create_panel_conf_1.default(this.editor);
        var panel = new Panel_1.default(this, conf);
        panel.create();
    };
    /**
     * 菜单表情点击事件
     */
    Emoticon.prototype.clickHandler = function () {
        this.createPanel();
    };
    Emoticon.prototype.tryChangeActive = function () { };
    return Emoticon;
}(PanelMenu_1.default));
exports.default = Emoticon;
//# sourceMappingURL=index.js.map