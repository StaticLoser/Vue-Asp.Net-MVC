"use strict";
/**
 * @description 视频 菜单
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var Panel_1 = tslib_1.__importDefault(require("../menu-constructors/Panel"));
var PanelMenu_1 = tslib_1.__importDefault(require("../menu-constructors/PanelMenu"));
var create_panel_conf_1 = tslib_1.__importDefault(require("./create-panel-conf"));
var index_1 = tslib_1.__importDefault(require("./bind-event/index"));
var Video = /** @class */ (function (_super) {
    tslib_1.__extends(Video, _super);
    function Video(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u89C6\u9891\">\n                <i class=\"w-e-icon-play\"></i>\n            </div>");
        _this = _super.call(this, $elem, editor) || this;
        // 绑定事件 tootip
        index_1.default(editor);
        return _this;
    }
    /**
     * 菜单点击事件
     */
    Video.prototype.clickHandler = function () {
        // 弹出 panel
        this.createPanel('');
    };
    /**
     * 创建 panel
     * @param link 链接
     */
    Video.prototype.createPanel = function (iframe) {
        var conf = create_panel_conf_1.default(this.editor, iframe);
        var panel = new Panel_1.default(this, conf);
        panel.create();
    };
    /**
     * 尝试修改菜单 active 状态
     */
    Video.prototype.tryChangeActive = function () { };
    return Video;
}(PanelMenu_1.default));
exports.default = Video;
//# sourceMappingURL=index.js.map