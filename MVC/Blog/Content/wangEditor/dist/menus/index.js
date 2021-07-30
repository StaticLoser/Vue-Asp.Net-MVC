"use strict";
/**
 * @description Menus 菜单栏 入口文件
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = tslib_1.__importDefault(require("../editor/index"));
var menu_list_1 = tslib_1.__importDefault(require("./menu-list"));
var dom_core_1 = tslib_1.__importDefault(require("./../utils/dom-core"));
// import { MenuActive } from './menu-constructors/Menu'
var Menus = /** @class */ (function () {
    function Menus(editor) {
        this.editor = editor;
        this.menuList = [];
        this.constructorList = menu_list_1.default; // 所有菜单构造函数的列表
    }
    /**
     * 自定义添加菜单
     * @param key 菜单 key ，和 editor.config.menus 对应
     * @param Menu 菜单构造函数
     */
    Menus.prototype.extend = function (key, Menu) {
        if (!Menu || typeof Menu !== 'function')
            return;
        this.constructorList[key] = Menu;
    };
    // 初始化菜单
    Menus.prototype.init = function () {
        var _this = this;
        // 从用户配置的 menus 入手，看需要初始化哪些菜单
        var config = this.editor.config;
        // 排除exclude包含的菜单
        var excludeMenus = config.excludeMenus;
        if (Array.isArray(excludeMenus) === false)
            excludeMenus = [];
        config.menus = config.menus.filter(function (key) { return excludeMenus.includes(key) === false; });
        // 排除自扩展中exclude包含的菜单
        var CustomMenuKeysList = Object.keys(index_1.default.globalCustomMenuConstructorList);
        CustomMenuKeysList = CustomMenuKeysList.filter(function (key) { return excludeMenus.includes(key); });
        CustomMenuKeysList.forEach(function (key) {
            delete index_1.default.globalCustomMenuConstructorList[key];
        });
        config.menus.forEach(function (menuKey) {
            var MenuConstructor = _this.constructorList[menuKey]; // 暂用 any ，后面再替换
            _this._initMenuList(menuKey, MenuConstructor);
        });
        // 全局注册
        for (var _i = 0, _a = Object.entries(index_1.default.globalCustomMenuConstructorList); _i < _a.length; _i++) {
            var _b = _a[_i], menuKey = _b[0], menuFun = _b[1];
            var MenuConstructor = menuFun; // 暂用 any ，后面再替换
            this._initMenuList(menuKey, MenuConstructor);
        }
        // 渲染 DOM
        this._addToToolbar();
        if (config.showMenuTooltips) {
            // 添加菜单栏tooltips
            this._bindMenuTooltips();
        }
    };
    /**
     * 创建 menu 实例，并放到 menuList 中
     * @param menuKey 菜单 key ，和 editor.config.menus 对应
     * @param MenuConstructor 菜单构造函数
     */
    Menus.prototype._initMenuList = function (menuKey, MenuConstructor) {
        if (MenuConstructor == null || typeof MenuConstructor !== 'function') {
            // 必须是 class
            return;
        }
        if (this.menuList.some(function (menu) { return menu.key === menuKey; })) {
            console.warn('菜单名称重复:' + menuKey);
        }
        else {
            var m = new MenuConstructor(this.editor);
            m.key = menuKey;
            this.menuList.push(m);
        }
    };
    // 绑定菜单栏tooltips
    Menus.prototype._bindMenuTooltips = function () {
        var editor = this.editor;
        var $toolbarElem = editor.$toolbarElem;
        var config = editor.config;
        // 若isTooltipShowTop为true则伪元素为下三角，反之为上三角
        var menuTooltipPosition = config.menuTooltipPosition;
        var $tooltipEl = dom_core_1.default("<div class=\"w-e-menu-tooltip w-e-menu-tooltip-" + menuTooltipPosition + "\">\n            <div class=\"w-e-menu-tooltip-item-wrapper\">\n              <div></div>\n            </div>\n          </div>");
        $tooltipEl.css('visibility', 'hidden');
        $toolbarElem.append($tooltipEl);
        // 设置 z-index
        $tooltipEl.css('z-index', editor.zIndex.get('tooltip'));
        var showTimeoutId = 0; // 定时器，延时200ms显示tooltips
        // 清空计时器
        function clearShowTimeoutId() {
            if (showTimeoutId) {
                clearTimeout(showTimeoutId);
            }
        }
        // 隐藏tooltip
        function hide() {
            clearShowTimeoutId();
            $tooltipEl.css('visibility', 'hidden');
        }
        // 事件监听
        $toolbarElem
            .on('mouseover', function (e) {
            var target = e.target;
            var $target = dom_core_1.default(target);
            var title;
            var $menuEl;
            if ($target.isContain($toolbarElem)) {
                hide();
                return;
            }
            if ($target.parentUntil('.w-e-droplist') != null) {
                // 处于droplist中时隐藏
                hide();
            }
            else {
                if ($target.attr('data-title')) {
                    title = $target.attr('data-title');
                    $menuEl = $target;
                }
                else {
                    var $parent = $target.parentUntil('.w-e-menu');
                    if ($parent != null) {
                        title = $parent.attr('data-title');
                        $menuEl = $parent;
                    }
                }
            }
            if (title && $menuEl) {
                clearShowTimeoutId();
                var targetOffset = $menuEl.getOffsetData();
                $tooltipEl.text(editor.i18next.t('menus.title.' + title));
                var tooltipOffset = $tooltipEl.getOffsetData();
                var left = targetOffset.left + targetOffset.width / 2 - tooltipOffset.width / 2;
                $tooltipEl.css('left', left + "px");
                // 2. 高度设置
                if (menuTooltipPosition === 'up') {
                    $tooltipEl.css('top', targetOffset.top - tooltipOffset.height - 8 + "px");
                }
                else if (menuTooltipPosition === 'down') {
                    $tooltipEl.css('top', targetOffset.top + targetOffset.height + 8 + "px");
                }
                showTimeoutId = window.setTimeout(function () {
                    $tooltipEl.css('visibility', 'visible');
                }, 200);
            }
            else {
                hide();
            }
        })
            .on('mouseleave', function () {
            hide();
        });
    };
    // 添加到菜单栏
    Menus.prototype._addToToolbar = function () {
        var editor = this.editor;
        var $toolbarElem = editor.$toolbarElem;
        // 遍历添加到 DOM
        this.menuList.forEach(function (menu) {
            var $elem = menu.$elem;
            if ($elem) {
                $toolbarElem.append($elem);
            }
        });
    };
    /**
     * 获取菜单对象
     * @param 菜单名称 小写
     * @return Menus 菜单对象
     */
    Menus.prototype.menuFind = function (key) {
        var menuList = this.menuList;
        for (var i = 0, l = menuList.length; i < l; i++) {
            if (menuList[i].key === key)
                return menuList[i];
        }
        return menuList[0];
    };
    /**
     * @description 修改菜单激活状态
     */
    Menus.prototype.changeActive = function () {
        this.menuList.forEach(function (menu) {
            setTimeout(menu.tryChangeActive.bind(menu), 100); // 暂用 any ，后面再替换
        });
    };
    return Menus;
}());
exports.default = Menus;
//# sourceMappingURL=index.js.map