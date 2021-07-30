"use strict";
/**
 * @description Menu class 父类
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Panel_1 = tslib_1.__importDefault(require("./Panel"));
var Menu = /** @class */ (function () {
    function Menu($elem, editor) {
        var _this = this;
        this.$elem = $elem;
        this.editor = editor;
        this._active = false;
        // 绑定菜单点击事件
        $elem.on('click', function (e) {
            Panel_1.default.hideCurAllPanels(); // 隐藏当前的所有 Panel
            // 触发菜单点击的钩子
            editor.txt.eventHooks.menuClickEvents.forEach(function (fn) { return fn(); });
            e.stopPropagation();
            if (editor.selection.getRange() == null) {
                return;
            }
            _this.clickHandler(e);
        });
    }
    /**
     * 菜单点击事件，子类可重写
     * @param e event
     */
    Menu.prototype.clickHandler = function (e) { };
    /**
     * 激活菜单，高亮显示
     */
    Menu.prototype.active = function () {
        this._active = true;
        this.$elem.addClass('w-e-active');
    };
    /**
     * 取消激活，不再高亮显示
     */
    Menu.prototype.unActive = function () {
        this._active = false;
        this.$elem.removeClass('w-e-active');
    };
    Object.defineProperty(Menu.prototype, "isActive", {
        /**
         * 是否处于激活状态
         */
        get: function () {
            return this._active;
        },
        enumerable: false,
        configurable: true
    });
    return Menu;
}());
exports.default = Menu;
//# sourceMappingURL=Menu.js.map