"use strict";
/**
 * @description 对齐方式
 * @author liuwei
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var SPECIAL_NODE_LIST = ['LI'];
var SPECIAL_TOP_NODE_LIST = ['UL', 'BLOCKQUOTE'];
var Justify = /** @class */ (function (_super) {
    tslib_1.__extends(Justify, _super);
    function Justify(editor) {
        var _this = this;
        var $elem = dom_core_1.default('<div class="w-e-menu" data-title="对齐"><i class="w-e-icon-paragraph-left"></i></div>');
        var dropListConf = {
            width: 100,
            title: '对齐方式',
            type: 'list',
            list: [
                {
                    $elem: dom_core_1.default("<p>\n                            <i class=\"w-e-icon-paragraph-left w-e-drop-list-item\"></i>\n                            " + editor.i18next.t('menus.dropListMenu.justify.靠左') + "\n                        </p>"),
                    value: 'left',
                },
                {
                    $elem: dom_core_1.default("<p>\n                            <i class=\"w-e-icon-paragraph-center w-e-drop-list-item\"></i>\n                            " + editor.i18next.t('menus.dropListMenu.justify.居中') + "\n                        </p>"),
                    value: 'center',
                },
                {
                    $elem: dom_core_1.default("<p>\n                            <i class=\"w-e-icon-paragraph-right w-e-drop-list-item\"></i>\n                            " + editor.i18next.t('menus.dropListMenu.justify.靠右') + "\n                        </p>"),
                    value: 'right',
                },
                {
                    $elem: dom_core_1.default("<p>\n                            <i class=\"w-e-icon-paragraph-justify w-e-drop-list-item\"></i>\n                            " + editor.i18next.t('menus.dropListMenu.justify.两端') + "\n                        </p>"),
                    value: 'justify',
                },
            ],
            clickHandler: function (value) {
                // 执行对应的value操作
                _this.command(value);
            },
        };
        _this = _super.call(this, $elem, editor, dropListConf) || this;
        return _this;
    }
    /**
     * 执行命令
     * @param value value
     */
    Justify.prototype.command = function (value) {
        var editor = this.editor;
        var selection = editor.selection;
        var $selectionElem = selection.getSelectionContainerElem();
        // 保存选区
        selection.saveRange();
        // 获取顶级元素
        var $elems = editor.selection.getSelectionRangeTopNodes();
        if ($selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.length) {
            // list 在chrome下默认多包裹一个 p，导致不能通过顶层元素判断，所以单独加个判断
            if (this.isSpecialNode($selectionElem, $elems[0]) || this.isSpecialTopNode($elems[0])) {
                var el = this.getSpecialNodeUntilTop($selectionElem, $elems[0]);
                if (el == null)
                    return;
                dom_core_1.default(el).css('text-align', value);
            }
            else {
                $elems.forEach(function (el) {
                    el.css('text-align', value);
                });
            }
        }
        //恢复选区
        selection.restoreSelection();
    };
    /**
     * 获取选区中的特殊元素，如果不存在，则直接返回顶层元素子元素
     * @param el DomElement
     * @param topEl DomElement
     */
    Justify.prototype.getSpecialNodeUntilTop = function (el, topEl) {
        var parentNode = el.elems[0];
        var topNode = topEl.elems[0];
        // 可能出现嵌套的情况，所以一级一级向上找，是否是特殊元素
        while (parentNode != null) {
            if (SPECIAL_NODE_LIST.indexOf(parentNode === null || parentNode === void 0 ? void 0 : parentNode.nodeName) !== -1) {
                return parentNode;
            }
            // 如果再到 top 元素之前还没找到特殊元素，直接返回元素
            if (parentNode.parentNode === topNode) {
                return parentNode;
            }
            parentNode = parentNode.parentNode;
        }
        return parentNode;
    };
    /**
     * 当选区元素或者顶层元素是某些特殊元素时，只需要修改子元素的对齐样式的元素
     * @param el DomElement
     * @param topEl DomElement
     */
    Justify.prototype.isSpecialNode = function (el, topEl) {
        // 如果以后有类似的元素要这样处理，直接修改这个数组即可
        var parentNode = this.getSpecialNodeUntilTop(el, topEl);
        if (parentNode == null)
            return false;
        return SPECIAL_NODE_LIST.indexOf(parentNode.nodeName) !== -1;
    };
    /**
     * 当选区 top 元素为某些特殊元素时，只需要修改子元素的对齐样式的元素
     * @param el DomElement
     */
    Justify.prototype.isSpecialTopNode = function (topEl) {
        var _a;
        if (topEl == null)
            return false;
        return SPECIAL_TOP_NODE_LIST.indexOf((_a = topEl.elems[0]) === null || _a === void 0 ? void 0 : _a.nodeName) !== -1;
    };
    /**
     * 尝试改变菜单激活（高亮）状态
     * 默认左对齐,若选择其他对其方式对active进行高亮否则unActive
     * ?考虑优化的话 是否可以对具体选中的进行高亮
     */
    Justify.prototype.tryChangeActive = function () { };
    return Justify;
}(DropListMenu_1.default));
exports.default = Justify;
//# sourceMappingURL=index.js.map