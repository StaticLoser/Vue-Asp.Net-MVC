"use strict";
/**
 * @description 段落行高 LineHeight
 * @author lichunlin
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var lineHeightList_1 = tslib_1.__importDefault(require("./lineHeightList"));
var util_1 = require("../../utils/util");
var LineHeight = /** @class */ (function (_super) {
    tslib_1.__extends(LineHeight, _super);
    function LineHeight(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u884C\u9AD8\">\n                    <i class=\"w-e-icon-row-height\"></i>\n                </div>");
        var lineHeightMenu = new lineHeightList_1.default(editor, editor.config.lineHeights);
        var DropListMenu = {
            width: 100,
            title: '设置行高',
            type: 'list',
            list: lineHeightMenu.getItemList(),
            clickHandler: function (value) {
                //保存焦点
                editor.selection.saveRange();
                _this.command(value);
            },
        };
        _this = _super.call(this, $elem, editor, DropListMenu) || this;
        return _this;
    }
    /**
     * 执行命令
     * @param value value
     */
    LineHeight.prototype.command = function (value) {
        var _this = this;
        var _a;
        var selection = window.getSelection ? window.getSelection() : document.getSelection();
        //允许设置dom
        var allowArray = ['P'];
        var editor = this.editor;
        var st = '';
        //恢复焦点
        editor.selection.restoreSelection();
        var $selectionElem = dom_core_1.default(editor.selection.getSelectionContainerElem());
        if (!($selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.length))
            return;
        var $selectionAll = dom_core_1.default(editor.selection.getSelectionContainerElem());
        // let dom:HTMLElement= $selectionElem.elems[0]
        var dom = dom_core_1.default(editor.selection.getSelectionStartElem()).elems[0];
        //获取元素的style
        var style = '';
        var styleList = [];
        //点击默认的时候删除line-height属性 并重新设置 style
        var styleStr = '';
        //选中多行操作
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            var isIE_1 = util_1.UA.isIE();
            //获取range 开头结束的dom在 祖父元素的下标
            var indexStore_1 = [];
            var arrayDom_a = [];
            var arrayDom_b = [];
            //获取range 开头结束的dom
            var StartElem_1 = dom_core_1.default(editor.selection.getSelectionStartElem());
            var EndElem_1 = dom_core_1.default(editor.selection.getSelectionEndElem());
            var childList = (_a = editor.selection.getRange()) === null || _a === void 0 ? void 0 : _a.commonAncestorContainer.childNodes;
            arrayDom_a.push(this.getDom(StartElem_1.elems[0]));
            childList === null || childList === void 0 ? void 0 : childList.forEach(function (item, index) {
                if (item === _this.getDom(StartElem_1.elems[0])) {
                    indexStore_1.push(index);
                }
                if (item === _this.getDom(EndElem_1.elems[0])) {
                    indexStore_1.push(index);
                }
            });
            //遍历 获取头尾之间的dom元素
            var i = 0;
            var d = void 0;
            arrayDom_b.push(this.getDom(StartElem_1.elems[0]));
            while (arrayDom_a[i] !== this.getDom(EndElem_1.elems[0])) {
                d = dom_core_1.default(arrayDom_a[i].nextElementSibling).elems[0];
                if (allowArray.indexOf(dom_core_1.default(d).getNodeName()) !== -1) {
                    arrayDom_b.push(d);
                    arrayDom_a.push(d);
                }
                else {
                    arrayDom_a.push(d);
                }
                i++;
            }
            //设置段落选取 全选
            if (dom_core_1.default(arrayDom_a[0]).getNodeName() !== 'P') {
                i = 0;
                //遍历集合得到第一个p标签的下标
                for (var k = 0; k < arrayDom_a.length; k++) {
                    if (dom_core_1.default(arrayDom_a[k]).getNodeName() === 'P') {
                        i = k;
                        break;
                    }
                }
                //i===0 说明选区中没有p段落
                if (i === 0) {
                    return;
                }
                var _i = 0;
                while (_i !== i) {
                    arrayDom_a.shift();
                    _i++;
                }
            }
            //设置替换的选区
            this.setRange(arrayDom_a[0], arrayDom_a[arrayDom_a.length - 1]);
            //生成innerHtml html字符串
            arrayDom_a.forEach(function (item) {
                style = item.getAttribute('style');
                styleList = style ? style.split(';') : [];
                styleStr = _this.styleProcessing(styleList);
                if (dom_core_1.default(item).getNodeName() === 'P') {
                    //判断是否 点击默认
                    if (value) {
                        styleStr += value ? "line-height:" + value + ";" : '';
                    }
                }
                if (!isIE_1) {
                    st += "<" + dom_core_1.default(item).getNodeName().toLowerCase() + " style=\"" + styleStr + "\">" + item.innerHTML + "</" + dom_core_1.default(item).getNodeName().toLowerCase() + ">";
                }
                else {
                    dom_core_1.default(item).css('line-height', value);
                }
            });
            if (st) {
                this.action(st, editor);
            }
            //恢复已选择的选区
            dom = $selectionAll.elems[0];
            this.setRange(dom.children[indexStore_1[0]], dom.children[indexStore_1[1]]);
            return;
        }
        //遍历dom 获取祖父元素 直到contenteditable属性的div标签
        dom = this.getDom(dom);
        //校验允许lineheight设置标签
        if (allowArray.indexOf(dom_core_1.default(dom).getNodeName()) === -1) {
            return;
        }
        style = dom.getAttribute('style');
        styleList = style ? style.split(';') : [];
        //全选 dom下所有的内容
        selection === null || selection === void 0 ? void 0 : selection.selectAllChildren(dom);
        //保存range
        editor.selection.saveRange();
        //判断是否存在value 默认 移除line-height
        if (!value) {
            if (style) {
                styleStr = this.styleProcessing(styleList);
                //避免没有其它属性 只留下 ‘style’ 减少代码
                if (styleStr === '') {
                    st = "<" + dom_core_1.default(dom).getNodeName().toLowerCase() + ">" + dom.innerHTML + "</" + dom_core_1.default(dom)
                        .getNodeName()
                        .toLowerCase() + ">";
                }
                else {
                    st = "<" + dom_core_1.default(dom).getNodeName().toLowerCase() + " style=\"" + styleStr + "\">" + dom.innerHTML + "</" + dom_core_1.default(dom).getNodeName().toLowerCase() + ">";
                }
                this.action(st, editor);
            }
            return;
        }
        if (style) {
            //存在style 检索其它style属性
            styleStr = this.styleProcessing(styleList) + ("line-height:" + value + ";");
        }
        else {
            styleStr = "line-height:" + value + ";";
        }
        st = "<" + dom_core_1.default(dom).getNodeName().toLowerCase() + " style=\"" + styleStr + "\">" + dom.innerHTML + "</" + dom_core_1.default(dom)
            .getNodeName()
            .toLowerCase() + ">";
        //防止BLOCKQUOTE叠加 or IE下导致P嵌套出现误删
        if (dom_core_1.default(dom).getNodeName() === 'BLOCKQUOTE' || util_1.UA.isIE()) {
            dom_core_1.default(dom).css('line-height', value);
        }
        else {
            this.action(st, editor);
        }
    };
    /**
     * 遍历dom 获取祖父元素 直到contenteditable属性的div标签
     *
     */
    LineHeight.prototype.getDom = function (dom) {
        var DOM = dom_core_1.default(dom).elems[0];
        if (!DOM.parentNode) {
            return DOM;
        }
        function getParentNode($node, editor) {
            var $parent = dom_core_1.default($node.parentNode);
            if (editor.$textElem.equal($parent)) {
                return $node;
            }
            else {
                return getParentNode($parent.elems[0], editor);
            }
        }
        DOM = getParentNode(DOM, this.editor);
        return DOM;
    };
    /**
     * 执行 document.execCommand
     *
     */
    LineHeight.prototype.action = function (html_str, editor) {
        editor.cmd.do('insertHTML', html_str);
    };
    /**
     * style 处理
     */
    LineHeight.prototype.styleProcessing = function (styleList) {
        var styleStr = '';
        styleList.forEach(function (item) {
            item !== '' && item.indexOf('line-height') === -1
                ? (styleStr = styleStr + item + ';')
                : '';
        });
        return styleStr;
    };
    /**
     * 段落全选 比如：避免11变成111
     */
    LineHeight.prototype.setRange = function (startDom, endDom) {
        var editor = this.editor;
        var selection = window.getSelection ? window.getSelection() : document.getSelection();
        //清除所有的选区
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        var range = document.createRange();
        var star = startDom;
        var end = endDom;
        range.setStart(star, 0);
        range.setEnd(end, 1);
        selection === null || selection === void 0 ? void 0 : selection.addRange(range);
        //保存设置好的选区
        editor.selection.saveRange();
        //清除所有的选区
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        //恢复选区
        editor.selection.restoreSelection();
    };
    /**
     * 尝试修改菜单激活状态
     */
    LineHeight.prototype.tryChangeActive = function () {
        var editor = this.editor;
        var $selectionElem = editor.selection.getSelectionContainerElem();
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            //避免选中多行设置
            return;
        }
        var dom = dom_core_1.default(editor.selection.getSelectionStartElem());
        // 有些情况下 dom 可能为空，比如编辑器初始化
        if (dom.length === 0)
            return;
        dom = this.getDom(dom.elems[0]);
        var style = dom.getAttribute('style') ? dom.getAttribute('style') : '';
        //判断当前标签是否具有line-height属性
        if (style && style.indexOf('line-height') !== -1) {
            this.active();
        }
        else {
            this.unActive();
        }
    };
    return LineHeight;
}(DropListMenu_1.default));
exports.default = LineHeight;
//# sourceMappingURL=index.js.map