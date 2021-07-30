"use strict";
/**
 * @description 初始化编辑器 DOM 结构
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorValidator = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var util_1 = require("../../utils/util");
var const_1 = require("../../utils/const");
var text_1 = tslib_1.__importDefault(require("../../config/text"));
var styleSettings = {
    border: '1px solid #c9d8db',
    toolbarBgColor: '#FFF',
    toolbarBottomBorder: '1px solid #EEE',
};
function default_1(editor) {
    var toolbarSelector = editor.toolbarSelector;
    var $toolbarSelector = dom_core_1.default(toolbarSelector);
    var textSelector = editor.textSelector;
    var config = editor.config;
    var height = config.height;
    var i18next = editor.i18next;
    var $toolbarElem = dom_core_1.default('<div></div>');
    var $textContainerElem = dom_core_1.default('<div></div>');
    var $textElem;
    var $children;
    var $subChildren = null;
    if (textSelector == null) {
        // 将编辑器区域原有的内容，暂存起来
        $children = $toolbarSelector.children();
        // 添加到 DOM 结构中
        $toolbarSelector.append($toolbarElem).append($textContainerElem);
        // 自行创建的，需要配置默认的样式
        $toolbarElem
            .css('background-color', styleSettings.toolbarBgColor)
            .css('border', styleSettings.border)
            .css('border-bottom', styleSettings.toolbarBottomBorder);
        $textContainerElem
            .css('border', styleSettings.border)
            .css('border-top', 'none')
            .css('height', height + "px");
    }
    else {
        // toolbarSelector 和 textSelector 都有
        $toolbarSelector.append($toolbarElem);
        // 菜单分离后，文本区域内容暂存
        $subChildren = dom_core_1.default(textSelector).children();
        dom_core_1.default(textSelector).append($textContainerElem);
        // 将编辑器区域原有的内容，暂存起来
        $children = $textContainerElem.children();
    }
    // 编辑区域
    $textElem = dom_core_1.default('<div></div>');
    $textElem.attr('contenteditable', 'true').css('width', '100%').css('height', '100%');
    // 添加 placeholder
    var $placeholder;
    var placeholder = editor.config.placeholder;
    if (placeholder !== text_1.default.placeholder) {
        $placeholder = dom_core_1.default("<div>" + placeholder + "</div>");
    }
    else {
        $placeholder = dom_core_1.default("<div>" + i18next.t(placeholder) + "</div>");
    }
    $placeholder.addClass('placeholder');
    // 初始化编辑区域内容
    if ($children && $children.length) {
        $textElem.append($children);
        // 编辑器有默认值的时候隐藏placeholder
        $placeholder.hide();
    }
    else {
        $textElem.append(dom_core_1.default(const_1.EMPTY_P)); // 新增一行，方便继续编辑
    }
    // 菜单分离后，文本区域有标签的带入编辑器内
    if ($subChildren && $subChildren.length) {
        $textElem.append($subChildren);
        // 编辑器有默认值的时候隐藏placeholder
        $placeholder.hide();
    }
    // 编辑区域加入DOM
    $textContainerElem.append($textElem);
    // 添加placeholder
    $textContainerElem.append($placeholder);
    // 设置通用的 class
    $toolbarElem.addClass('w-e-toolbar').css('z-index', editor.zIndex.get('toolbar'));
    $textContainerElem.addClass('w-e-text-container');
    $textContainerElem.css('z-index', editor.zIndex.get());
    $textElem.addClass('w-e-text');
    // 添加 ID
    var toolbarElemId = util_1.getRandom('toolbar-elem');
    $toolbarElem.attr('id', toolbarElemId);
    var textElemId = util_1.getRandom('text-elem');
    $textElem.attr('id', textElemId);
    // 判断编辑区与容器高度是否一致
    var textContainerCliheight = $textContainerElem.getBoundingClientRect().height;
    var textElemClientHeight = $textElem.getBoundingClientRect().height;
    if (textContainerCliheight !== textElemClientHeight) {
        $textElem.css('min-height', textContainerCliheight + 'px');
    }
    // 记录属性
    editor.$toolbarElem = $toolbarElem;
    editor.$textContainerElem = $textContainerElem;
    editor.$textElem = $textElem;
    editor.toolbarElemId = toolbarElemId;
    editor.textElemId = textElemId;
}
exports.default = default_1;
/**
 * 工具栏/文本区域 DOM selector 有效性验证
 * @param editor 编辑器实例
 */
function selectorValidator(editor) {
    var name = 'data-we-id';
    var regexp = /^wangEditor-\d+$/;
    var textSelector = editor.textSelector, toolbarSelector = editor.toolbarSelector;
    var $el = {
        bar: dom_core_1.default('<div></div>'),
        text: dom_core_1.default('<div></div>'),
    };
    if (toolbarSelector == null) {
        throw new Error('错误：初始化编辑器时候未传入任何参数，请查阅文档');
    }
    else {
        $el.bar = dom_core_1.default(toolbarSelector);
        if (!$el.bar.elems.length) {
            throw new Error("\u65E0\u6548\u7684\u8282\u70B9\u9009\u62E9\u5668\uFF1A" + toolbarSelector);
        }
        if (regexp.test($el.bar.attr(name))) {
            throw new Error('初始化节点已存在编辑器实例，无法重复创建编辑器');
        }
    }
    if (textSelector) {
        $el.text = dom_core_1.default(textSelector);
        if (!$el.text.elems.length) {
            throw new Error("\u65E0\u6548\u7684\u8282\u70B9\u9009\u62E9\u5668\uFF1A" + textSelector);
        }
        if (regexp.test($el.text.attr(name))) {
            throw new Error('初始化节点已存在编辑器实例，无法重复创建编辑器');
        }
    }
    // 给节点做上标记
    $el.bar.attr(name, editor.id);
    $el.text.attr(name, editor.id);
    // 在编辑器销毁前取消标记
    editor.beforeDestroy(function () {
        $el.bar.removeAttr(name);
        $el.text.removeAttr(name);
    });
}
exports.selectorValidator = selectorValidator;
//# sourceMappingURL=init-dom.js.map