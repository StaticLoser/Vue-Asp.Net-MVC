"use strict";
/**
 * @description 标题
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var util_1 = require("../../utils/util");
var const_1 = require("../../utils/const");
var Head = /** @class */ (function (_super) {
    tslib_1.__extends(Head, _super);
    function Head(editor) {
        var _this = this;
        var $elem = dom_core_1.default('<div class="w-e-menu" data-title="标题"><i class="w-e-icon-header"></i></div>');
        var dropListConf = {
            width: 100,
            title: '设置标题',
            type: 'list',
            list: [
                { $elem: dom_core_1.default('<h1>H1</h1>'), value: '<h1>' },
                { $elem: dom_core_1.default('<h2>H2</h2>'), value: '<h2>' },
                { $elem: dom_core_1.default('<h3>H3</h3>'), value: '<h3>' },
                { $elem: dom_core_1.default('<h4>H4</h4>'), value: '<h4>' },
                { $elem: dom_core_1.default('<h5>H5</h5>'), value: '<h5>' },
                {
                    $elem: dom_core_1.default("<p>" + editor.i18next.t('menus.dropListMenu.head.正文') + "</p>"),
                    value: '<p>',
                },
            ],
            clickHandler: function (value) {
                // 注意 this 是指向当前的 Head 对象
                _this.command(value);
            },
        };
        _this = _super.call(this, $elem, editor, dropListConf) || this;
        var onCatalogChange = editor.config.onCatalogChange;
        // 未配置目录change监听回调时不运行下面操作
        if (onCatalogChange) {
            _this.oldCatalogs = [];
            _this.addListenerCatalog(); // 监听文本框编辑时的大纲信息
            _this.getCatalogs(); // 初始有值的情况获取一遍大纲信息
        }
        return _this;
    }
    /**
     * 执行命令
     * @param value value
     */
    Head.prototype.command = function (value) {
        var editor = this.editor;
        var $selectionElem = editor.selection.getSelectionContainerElem();
        if ($selectionElem && editor.$textElem.equal($selectionElem)) {
            // 不能选中多行来设置标题，否则会出现问题
            // 例如选中的是 <p>xxx</p><p>yyy</p> 来设置标题，设置之后会成为 <h1>xxx<br>yyy</h1> 不符合预期
            this.setMultilineHead(value);
        }
        else {
            // 选中内容包含序列，code，表格，分割线时不处理
            if (['OL', 'UL', 'LI', 'TABLE', 'TH', 'TR', 'CODE', 'HR'].indexOf(dom_core_1.default($selectionElem).getNodeName()) > -1) {
                return;
            }
            editor.cmd.do('formatBlock', value);
        }
        // 标题设置成功且不是<p>正文标签就配置大纲id
        value !== '<p>' && this.addUidForSelectionElem();
    };
    /**
     * 为标题设置大纲
     */
    Head.prototype.addUidForSelectionElem = function () {
        var editor = this.editor;
        var tag = editor.selection.getSelectionContainerElem();
        var id = util_1.getRandomCode(); // 默认五位数id
        dom_core_1.default(tag).attr('id', id);
    };
    /**
     * 监听change事件来返回大纲信息
     */
    Head.prototype.addListenerCatalog = function () {
        var _this = this;
        var editor = this.editor;
        editor.txt.eventHooks.changeEvents.push(function () {
            _this.getCatalogs();
        });
    };
    /**
     * 获取大纲数组
     */
    Head.prototype.getCatalogs = function () {
        var editor = this.editor;
        var $textElem = this.editor.$textElem;
        var onCatalogChange = editor.config.onCatalogChange;
        var elems = $textElem.find('h1,h2,h3,h4,h5');
        var catalogs = [];
        elems.forEach(function (elem, index) {
            var $elem = dom_core_1.default(elem);
            var id = $elem.attr('id');
            var tag = $elem.getNodeName();
            var text = $elem.text();
            if (!id) {
                id = util_1.getRandomCode();
                $elem.attr('id', id);
            }
            // 标题为空的情况不生成目录
            if (!text)
                return;
            catalogs.push({
                tag: tag,
                id: id,
                text: text,
            });
        });
        // 旧目录和新目录对比是否相等，不相等则运行回调并保存新目录到旧目录变量，以方便下一次对比
        if (JSON.stringify(this.oldCatalogs) !== JSON.stringify(catalogs)) {
            this.oldCatalogs = catalogs;
            onCatalogChange && onCatalogChange(catalogs);
        }
    };
    /**
     * 设置选中的多行标题
     * @param value  需要执行的命令值
     */
    Head.prototype.setMultilineHead = function (value) {
        var _this = this;
        var _a, _b;
        var editor = this.editor;
        var $selection = editor.selection;
        // 初始选区的父节点
        var containerElem = (_a = $selection.getSelectionContainerElem()) === null || _a === void 0 ? void 0 : _a.elems[0];
        // 白名单：用户选区里如果有该元素则不进行转换
        var _WHITE_LIST = [
            'IMG',
            'VIDEO',
            'TABLE',
            'TH',
            'TR',
            'UL',
            'OL',
            'PRE',
            'HR',
            'BLOCKQUOTE',
        ];
        // 获取选中的首、尾元素
        var startElem = dom_core_1.default($selection.getSelectionStartElem());
        var endElem = dom_core_1.default($selection.getSelectionEndElem());
        // 判断用户选中元素是否为最后一个空元素，如果是将endElem指向上一个元素
        if (endElem.elems[0].outerHTML === dom_core_1.default(const_1.EMPTY_P).elems[0].outerHTML &&
            !endElem.elems[0].nextSibling) {
            endElem = endElem.prev();
        }
        // 存放选中的所有元素
        var cacheDomList = [];
        cacheDomList.push(startElem.getNodeTop(editor));
        // 选中首尾元素在父级下的坐标
        var indexList = [];
        // 选区共同祖先元素的所有子节点
        var childList = (_b = $selection.getRange()) === null || _b === void 0 ? void 0 : _b.commonAncestorContainer.childNodes;
        // 找到选区的首尾元素的下标，方便最后恢复选区
        childList === null || childList === void 0 ? void 0 : childList.forEach(function (item, index) {
            if (item === cacheDomList[0].getNode()) {
                indexList.push(index);
            }
            if (item === endElem.getNodeTop(editor).getNode()) {
                indexList.push(index);
            }
        });
        // 找到首尾元素中间所包含的所有dom
        var i = 0;
        // 数组中的当前元素不等于选区最后一个节点时循环寻找中间节点
        while (cacheDomList[i].getNode() !== endElem.getNodeTop(editor).getNode()) {
            // 严谨性判断，是否元素为空
            if (!cacheDomList[i].elems[0])
                return;
            var d = dom_core_1.default(cacheDomList[i].next().getNode());
            cacheDomList.push(d);
            i++;
        }
        // 将选区内的所有子节点进行遍历生成对应的标签
        cacheDomList === null || cacheDomList === void 0 ? void 0 : cacheDomList.forEach(function (_node, index) {
            // 判断元素是否含有白名单内的标签元素
            if (!_this.hasTag(_node, _WHITE_LIST)) {
                var $h = dom_core_1.default(value);
                var $parentNode = _node.parent().getNode();
                // 设置标签内容
                $h.html("" + _node.html());
                // 插入生成的新标签
                $parentNode.insertBefore($h.getNode(), _node.getNode());
                // 移除原有的标签
                _node.remove();
            }
        });
        // 重新设置选区起始位置，保留拖蓝区域
        $selection.createRangeByElems(containerElem.children[indexList[0]], containerElem.children[indexList[1]]);
    };
    /**
     * 是否含有某元素
     * @param elem 需要检查的元素
     * @param whiteList 白名单
     */
    Head.prototype.hasTag = function (elem, whiteList) {
        var _this = this;
        var _a;
        if (!elem)
            return false;
        if (whiteList.includes(elem === null || elem === void 0 ? void 0 : elem.getNodeName()))
            return true;
        var _flag = false;
        (_a = elem.children()) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
            _flag = _this.hasTag(dom_core_1.default(child), whiteList);
        });
        return _flag;
    };
    /**
     * 尝试改变菜单激活（高亮）状态
     */
    Head.prototype.tryChangeActive = function () {
        var editor = this.editor;
        var reg = /^h/i;
        var cmdValue = editor.cmd.queryCommandValue('formatBlock');
        if (reg.test(cmdValue)) {
            this.active();
        }
        else {
            this.unActive();
        }
    };
    return Head;
}(DropListMenu_1.default));
exports.default = Head;
//# sourceMappingURL=index.js.map