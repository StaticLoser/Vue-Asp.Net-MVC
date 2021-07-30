"use strict";
/**
 * @description 下拉菜单 Class
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var Menu_1 = tslib_1.__importDefault(require("./Menu"));
var DropList_1 = tslib_1.__importDefault(require("./DropList"));
var DropListMenu = /** @class */ (function (_super) {
    tslib_1.__extends(DropListMenu, _super);
    function DropListMenu($elem, editor, conf) {
        var _this = _super.call(this, $elem, editor) || this;
        // 国际化
        conf.title = editor.i18next.t("menus.dropListMenu." + conf.title);
        // 非中文模式下 带 icon 的下拉列表居左
        var className = editor.config.lang === 'zh-CN' ? '' : 'w-e-drop-list-tl';
        if (className !== '' && conf.type === 'list') {
            conf.list.forEach(function (item) {
                var $elem = item.$elem;
                var $children = dom_core_1.default($elem.children());
                if ($children.length > 0) {
                    var nodeName = $children === null || $children === void 0 ? void 0 : $children.getNodeName();
                    if (nodeName && nodeName === 'I') {
                        $elem.addClass(className);
                    }
                }
            });
        }
        // 初始化 dropList
        var dropList = new DropList_1.default(_this, conf);
        _this.dropList = dropList;
        // 绑定事件
        $elem
            .on('click', function () {
            if (editor.selection.getRange() == null) {
                return;
            }
            $elem.css('z-index', editor.zIndex.get('menu'));
            // 触发 droplist 悬浮事件
            editor.txt.eventHooks.dropListMenuHoverEvents.forEach(function (fn) { return fn(); });
            // 显示
            dropList.show();
        })
            .on('mouseleave', function () {
            $elem.css('z-index', 'auto');
            // 隐藏
            dropList.hideTimeoutId = window.setTimeout(function () {
                dropList.hide();
            });
        });
        return _this;
    }
    return DropListMenu;
}(Menu_1.default));
exports.default = DropListMenu;
//# sourceMappingURL=DropListMenu.js.map