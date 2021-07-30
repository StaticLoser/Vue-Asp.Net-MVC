"use strict";
/**
 * @description 插入、上传图片
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var const_1 = require("../../utils/const");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var Panel_1 = tslib_1.__importDefault(require("../menu-constructors/Panel"));
var PanelMenu_1 = tslib_1.__importDefault(require("../menu-constructors/PanelMenu"));
var index_1 = tslib_1.__importDefault(require("./bind-event/index"));
var create_panel_conf_1 = tslib_1.__importDefault(require("./create-panel-conf"));
var Image = /** @class */ (function (_super) {
    tslib_1.__extends(Image, _super);
    function Image(editor) {
        var _this = this;
        var $elem = dom_core_1.default('<div class="w-e-menu" data-title="图片"><i class="w-e-icon-image"></i></div>');
        var imgPanelConfig = create_panel_conf_1.default(editor);
        if (imgPanelConfig.onlyUploadConf) {
            $elem = imgPanelConfig.onlyUploadConf.$elem;
            imgPanelConfig.onlyUploadConf.events.map(function (event) {
                var type = event.type;
                var fn = event.fn || const_1.EMPTY_FN;
                $elem.on(type, function (e) {
                    e.stopPropagation();
                    fn(e);
                });
            });
        }
        _this = _super.call(this, $elem, editor) || this;
        _this.imgPanelConfig = imgPanelConfig;
        // 绑定事件，如粘贴图片
        index_1.default(editor);
        return _this;
    }
    /**
     * 菜单点击事件
     */
    Image.prototype.clickHandler = function () {
        if (!this.imgPanelConfig.onlyUploadConf) {
            this.createPanel();
        }
    };
    /**
     * 创建 panel
     */
    Image.prototype.createPanel = function () {
        var conf = this.imgPanelConfig;
        var panel = new Panel_1.default(this, conf);
        this.setPanel(panel);
        panel.create();
    };
    /**
     * 尝试修改菜单 active 状态
     */
    Image.prototype.tryChangeActive = function () { };
    return Image;
}(PanelMenu_1.default));
exports.default = Image;
//# sourceMappingURL=index.js.map