"use strict";
/**
 * @description 下拉列表 class
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var const_1 = require("../../utils/const");
var DropList = /** @class */ (function () {
    function DropList(menu, conf) {
        var _this = this;
        this.hideTimeoutId = 0;
        this.menu = menu;
        this.conf = conf;
        // 容器
        var $container = dom_core_1.default('<div class="w-e-droplist"></div>');
        // 标题
        var $title = dom_core_1.default("<p>" + conf.title + "</p>");
        $title.addClass('w-e-dp-title');
        $container.append($title);
        // 列表和类型
        var list = conf.list || [];
        var type = conf.type || 'list';
        // item 的点击事件
        var clickHandler = conf.clickHandler || const_1.EMPTY_FN;
        // 加入 DOM 并绑定事件
        var $list = dom_core_1.default('<ul class="' + (type === 'list' ? 'w-e-list' : 'w-e-block') + '"></ul>');
        list.forEach(function (item) {
            var $elem = item.$elem;
            var value = item.value;
            var $li = dom_core_1.default('<li class="w-e-item"></li>');
            if ($elem) {
                $li.append($elem);
                $list.append($li);
                $li.on('click', function (e) {
                    clickHandler(value);
                    // 阻止冒泡
                    e.stopPropagation();
                    // item 点击之后，隐藏 list
                    _this.hideTimeoutId = window.setTimeout(function () {
                        _this.hide();
                    });
                });
            }
        });
        $container.append($list);
        // 绑定隐藏事件
        $container.on('mouseleave', function () {
            _this.hideTimeoutId = window.setTimeout(function () {
                _this.hide();
            });
        });
        // 记录属性
        this.$container = $container;
        this.rendered = false;
        this._show = false;
    }
    /**
     * 显示 DropList
     */
    DropList.prototype.show = function () {
        if (this.hideTimeoutId) {
            // 清除之前的定时隐藏
            clearTimeout(this.hideTimeoutId);
        }
        var menu = this.menu;
        var $menuELem = menu.$elem;
        var $container = this.$container;
        if (this._show) {
            return;
        }
        if (this.rendered) {
            // 显示
            $container.show();
        }
        else {
            // 加入 DOM 之前先定位位置
            var menuHeight = $menuELem.getBoundingClientRect().height || 0;
            var width = this.conf.width || 100; // 默认为 100
            $container.css('margin-top', menuHeight + 'px').css('width', width + 'px');
            // 加入到 DOM
            $menuELem.append($container);
            this.rendered = true;
        }
        // 修改属性
        this._show = true;
    };
    /**
     * 隐藏 DropList
     */
    DropList.prototype.hide = function () {
        var $container = this.$container;
        if (!this._show) {
            return;
        }
        // 隐藏并需改属性
        $container.hide();
        this._show = false;
    };
    Object.defineProperty(DropList.prototype, "isShow", {
        get: function () {
            return this._show;
        },
        enumerable: false,
        configurable: true
    });
    return DropList;
}());
exports.default = DropList;
//# sourceMappingURL=DropList.js.map