"use strict";
/**
 * @description Tooltip class
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var Tooltip = /** @class */ (function () {
    function Tooltip(editor, $elem, conf) {
        this.editor = editor;
        this.$targetElem = $elem;
        this.conf = conf;
        this._show = false;
        this._isInsertTextContainer = false;
        // 定义 container
        var $container = dom_core_1.default('<div></div>');
        $container.addClass('w-e-tooltip');
        this.$container = $container;
    }
    /**
     * 获取 tooltip 定位
     */
    Tooltip.prototype.getPositionData = function () {
        var $container = this.$container;
        var top = 0;
        var left = 0;
        // tooltip 的高度
        var tooltipHeight = 20;
        // 网页的 scrollTop
        var pageScrollTop = document.documentElement.scrollTop;
        // 目标元素的 rect
        var targetElemRect = this.$targetElem.getBoundingClientRect();
        // 编辑区域的 rect
        var textElemRect = this.editor.$textElem.getBoundingClientRect();
        // 获取基于 textContainerElem 的 位置信息
        var targetOffset = this.$targetElem.getOffsetData();
        var targetParentElem = dom_core_1.default(targetOffset.parent);
        // 获取 编辑区域的滚动条信息
        var scrollTop = this.editor.$textElem.elems[0].scrollTop;
        // 是否插入 textContainer 中
        this._isInsertTextContainer = targetParentElem.equal(this.editor.$textContainerElem);
        if (this._isInsertTextContainer) {
            // 父容器的高度
            var targetParentElemHeight = targetParentElem.getBoundingClientRect().height;
            // 相对于父容器的位置信息
            var offsetTop = targetOffset.top, offsetLeft = targetOffset.left, offsetHeight = targetOffset.height;
            // 元素基于父容器的 绝对top信息
            var absoluteTop = offsetTop - scrollTop;
            if (absoluteTop > tooltipHeight + 5) {
                // 说明模板元素的顶部空间足够
                top = absoluteTop - tooltipHeight - 15;
                $container.addClass('w-e-tooltip-up');
            }
            else if (absoluteTop + offsetHeight + tooltipHeight < targetParentElemHeight) {
                // 说明模板元素的底部空间足够
                top = absoluteTop + offsetHeight + 10;
                $container.addClass('w-e-tooltip-down');
            }
            else {
                // 其他情况，tooltip 放在目标元素左上角
                top = (absoluteTop > 0 ? absoluteTop : 0) + tooltipHeight + 10;
                $container.addClass('w-e-tooltip-down');
            }
            // 计算 left
            if (offsetLeft < 0) {
                left = 0;
            }
            else {
                left = offsetLeft;
            }
        }
        else {
            if (targetElemRect.top < tooltipHeight) {
                // 说明目标元素的顶部，因滑动隐藏在浏览器上方。tooltip 要放在目标元素下面
                top = targetElemRect.bottom + pageScrollTop + 5; // 5px 间距
                $container.addClass('w-e-tooltip-down');
            }
            else if (targetElemRect.top - textElemRect.top < tooltipHeight) {
                // 说明目标元素的顶部，因滑动隐藏在编辑区域上方。tooltip 要放在目标元素下面
                top = targetElemRect.bottom + pageScrollTop + 5; // 5px 间距
                $container.addClass('w-e-tooltip-down');
            }
            else {
                // 其他情况，tooltip 放在目标元素上方
                top = targetElemRect.top + pageScrollTop - tooltipHeight - 15; // 减去 toolbar 的高度，还有 15px 间距
                $container.addClass('w-e-tooltip-up');
            }
            // 计算 left
            if (targetElemRect.left < 0) {
                left = 0;
            }
            else {
                left = targetElemRect.left;
            }
        }
        // 返回结果
        return { top: top, left: left };
    };
    /**
     * 添加 tooltip 菜单
     */
    Tooltip.prototype.appendMenus = function () {
        var _this = this;
        var conf = this.conf;
        var editor = this.editor;
        var $targetElem = this.$targetElem;
        var $container = this.$container;
        conf.forEach(function (item, index) {
            // 添加元素
            var $elem = item.$elem;
            var $wrapper = dom_core_1.default('<div></div>');
            $wrapper.addClass('w-e-tooltip-item-wrapper ');
            $wrapper.append($elem);
            $container.append($wrapper);
            // 绑定点击事件
            $elem.on('click', function (e) {
                e.preventDefault();
                var res = item.onClick(editor, $targetElem);
                if (res)
                    _this.remove();
            });
        });
    };
    /**
     * 创建 tooltip
     */
    Tooltip.prototype.create = function () {
        var editor = this.editor;
        var $container = this.$container;
        // 生成 container 的内容
        this.appendMenus();
        // 设置定位
        var _a = this.getPositionData(), top = _a.top, left = _a.left;
        $container.css('top', top + "px");
        $container.css('left', left + "px");
        // 设置 z-index
        $container.css('z-index', editor.zIndex.get('tooltip'));
        // 添加到 DOM
        if (this._isInsertTextContainer) {
            this.editor.$textContainerElem.append($container);
        }
        else {
            dom_core_1.default('body').append($container);
        }
        this._show = true;
        editor.beforeDestroy(this.remove.bind(this));
        editor.txt.eventHooks.onBlurEvents.push(this.remove.bind(this));
    };
    /**
     * 移除该 tooltip
     */
    Tooltip.prototype.remove = function () {
        this.$container.remove();
        this._show = false;
    };
    Object.defineProperty(Tooltip.prototype, "isShow", {
        /**
         * 是否显示
         */
        get: function () {
            return this._show;
        },
        enumerable: false,
        configurable: true
    });
    return Tooltip;
}());
exports.default = Tooltip;
//# sourceMappingURL=Tooltip.js.map