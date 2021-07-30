"use strict";
/**
 * @description panel class
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var const_1 = require("../../utils/const");
var Panel = /** @class */ (function () {
    function Panel(menu, conf) {
        this.menu = menu;
        this.conf = conf;
        this.$container = dom_core_1.default('<div class="w-e-panel-container"></div>');
        // 隐藏 panel
        var editor = menu.editor;
        editor.txt.eventHooks.clickEvents.push(Panel.hideCurAllPanels);
        editor.txt.eventHooks.toolbarClickEvents.push(Panel.hideCurAllPanels);
        editor.txt.eventHooks.dropListMenuHoverEvents.push(Panel.hideCurAllPanels);
    }
    /**
     * 创建并展示 panel
     */
    Panel.prototype.create = function () {
        var _this = this;
        var menu = this.menu;
        if (Panel.createdMenus.has(menu)) {
            // 创建过了
            return;
        }
        var conf = this.conf;
        // panel 的容器
        var $container = this.$container;
        var width = conf.width || 300; // 默认 300px
        var rect = menu.editor.$toolbarElem.getBoundingClientRect();
        var menuRect = menu.$elem.getBoundingClientRect();
        var top = rect.height + rect.top - menuRect.top;
        var left = (rect.width - width) / 2 + rect.left - menuRect.left;
        var offset = 300; // icon与panel菜单距离偏移量暂定 300
        if (Math.abs(left) > offset) {
            // panel菜单离工具栏icon过远时，让panel菜单出现在icon正下方，处理边界逻辑
            if (menuRect.left < document.documentElement.clientWidth / 2) {
                // icon在左侧
                left = -menuRect.width / 2;
            }
            else {
                // icon在右侧
                left = -width + menuRect.width / 2;
            }
        }
        $container
            .css('width', width + 'px')
            .css('margin-top', top + "px")
            .css('margin-left', left + "px")
            .css('z-index', menu.editor.zIndex.get('panel'));
        // 添加关闭按钮
        var $closeBtn = dom_core_1.default('<i class="w-e-icon-close w-e-panel-close"></i>');
        $container.append($closeBtn);
        $closeBtn.on('click', function () {
            _this.remove();
        });
        // 准备 tabs 容器
        var $tabTitleContainer = dom_core_1.default('<ul class="w-e-panel-tab-title"></ul>');
        var $tabContentContainer = dom_core_1.default('<div class="w-e-panel-tab-content"></div>');
        $container.append($tabTitleContainer).append($tabContentContainer);
        // 设置高度
        var height = conf.height; // height: 0 即不用设置
        if (height) {
            $tabContentContainer.css('height', height + 'px').css('overflow-y', 'auto');
        }
        // tabs
        var tabs = conf.tabs || [];
        var tabTitleArr = [];
        var tabContentArr = [];
        tabs.forEach(function (tab, tabIndex) {
            if (!tab) {
                return;
            }
            var title = tab.title || '';
            var tpl = tab.tpl || '';
            // 添加到 DOM
            var $title = dom_core_1.default("<li class=\"w-e-item\">" + title + "</li>");
            $tabTitleContainer.append($title);
            var $content = dom_core_1.default(tpl);
            $tabContentContainer.append($content);
            // 记录到内存
            tabTitleArr.push($title);
            tabContentArr.push($content);
            // 设置 active 项
            if (tabIndex === 0) {
                $title.data('active', true);
                $title.addClass('w-e-active');
            }
            else {
                $content.hide();
            }
            // 绑定 tab 的事件
            $title.on('click', function () {
                if ($title.data('active')) {
                    return;
                }
                // 隐藏所有的 tab
                tabTitleArr.forEach(function ($title) {
                    $title.data('active', false);
                    $title.removeClass('w-e-active');
                });
                tabContentArr.forEach(function ($content) {
                    $content.hide();
                });
                // 显示当前的 tab
                $title.data('active', true);
                $title.addClass('w-e-active');
                $content.show();
            });
        });
        // 绑定关闭事件
        $container.on('click', function (e) {
            // 点击时阻止冒泡
            e.stopPropagation();
        });
        // 添加到 DOM
        menu.$elem.append($container);
        // 绑定 conf events 的事件，只有添加到 DOM 之后才能绑定成功
        tabs.forEach(function (tab, index) {
            if (!tab) {
                return;
            }
            var events = tab.events || [];
            events.forEach(function (event) {
                var selector = event.selector;
                var type = event.type;
                var fn = event.fn || const_1.EMPTY_FN;
                var $content = tabContentArr[index];
                $content.find(selector).on(type, function (e) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var needToHide;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                e.stopPropagation();
                                return [4 /*yield*/, fn(e)
                                    // 执行完事件之后，是否要关闭 panel
                                ];
                            case 1:
                                needToHide = _a.sent();
                                // 执行完事件之后，是否要关闭 panel
                                if (needToHide) {
                                    this.remove();
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
        // focus 第一个 elem
        var $inputs = $container.find('input[type=text],textarea');
        if ($inputs.length) {
            $inputs.get(0).focus();
        }
        // 隐藏其他 panel
        Panel.hideCurAllPanels();
        // 记录该 menu 已经创建了 panel
        menu.setPanel(this);
        Panel.createdMenus.add(menu);
    };
    /**
     * 移除 penal
     */
    Panel.prototype.remove = function () {
        var menu = this.menu;
        var $container = this.$container;
        if ($container) {
            $container.remove();
        }
        // 将该 menu 记录中移除
        Panel.createdMenus.delete(menu);
    };
    /**
     * 隐藏当前所有的 panel
     */
    Panel.hideCurAllPanels = function () {
        if (Panel.createdMenus.size === 0) {
            return;
        }
        Panel.createdMenus.forEach(function (menu) {
            var panel = menu.panel;
            panel && panel.remove();
        });
    };
    // 记录已经创建过的 panelMenu
    Panel.createdMenus = new Set();
    return Panel;
}());
exports.default = Panel;
//# sourceMappingURL=Panel.js.map