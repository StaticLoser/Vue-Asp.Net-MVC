"use strict";
/**
 * @description 编辑器 class
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../utils/dom-core"));
var util_1 = require("../utils/util");
var config_1 = tslib_1.__importDefault(require("../config"));
var selection_1 = tslib_1.__importDefault(require("./selection"));
var command_1 = tslib_1.__importDefault(require("./command"));
var index_1 = tslib_1.__importDefault(require("../text/index"));
var index_2 = tslib_1.__importDefault(require("../menus/index"));
var init_dom_1 = tslib_1.__importStar(require("./init-fns/init-dom"));
var init_selection_1 = tslib_1.__importDefault(require("./init-fns/init-selection"));
var bind_event_1 = tslib_1.__importDefault(require("./init-fns/bind-event"));
var i18next_init_1 = tslib_1.__importDefault(require("./init-fns/i18next-init"));
var set_full_screen_1 = tslib_1.__importStar(require("./init-fns/set-full-screen"));
var scroll_to_head_1 = tslib_1.__importDefault(require("./init-fns/scroll-to-head"));
var z_index_1 = tslib_1.__importDefault(require("./z-index"));
var index_3 = tslib_1.__importDefault(require("./change/index"));
var index_4 = tslib_1.__importDefault(require("./history/index"));
var disable_1 = tslib_1.__importDefault(require("./disable"));
var plugins_1 = tslib_1.__importStar(require("../plugins"));
var BtnMenu_1 = tslib_1.__importDefault(require("../menus/menu-constructors/BtnMenu"));
var DropList_1 = tslib_1.__importDefault(require("../menus/menu-constructors/DropList"));
var DropListMenu_1 = tslib_1.__importDefault(require("../menus/menu-constructors/DropListMenu"));
var Panel_1 = tslib_1.__importDefault(require("../menus/menu-constructors/Panel"));
var PanelMenu_1 = tslib_1.__importDefault(require("../menus/menu-constructors/PanelMenu"));
var Tooltip_1 = tslib_1.__importDefault(require("../menus/menu-constructors/Tooltip"));
var EDITOR_ID = 1;
var Editor = /** @class */ (function () {
    /**
     * 构造函数
     * @param toolbarSelector 工具栏 DOM selector
     * @param textSelector 文本区域 DOM selector
     */
    function Editor(toolbarSelector, textSelector) {
        this.pluginsFunctionList = {};
        // 实例销毁前需要执行的钩子集合
        this.beforeDestroyHooks = [];
        // id，用以区分单个页面不同的编辑器对象
        this.id = "wangEditor-" + EDITOR_ID++;
        this.toolbarSelector = toolbarSelector;
        this.textSelector = textSelector;
        init_dom_1.selectorValidator(this);
        // 属性的默认值，后面可能会再修改
        // 默认配置 - 当一个页面有多个编辑器的时候，因为 JS 的特性(引用类型)会导致多个编辑器的 config 引用是同一个，所以需要 深度克隆 断掉引用
        this.config = util_1.deepClone(config_1.default);
        this.$toolbarElem = dom_core_1.default('<div></div>');
        this.$textContainerElem = dom_core_1.default('<div></div>');
        this.$textElem = dom_core_1.default('<div></div>');
        this.toolbarElemId = '';
        this.textElemId = '';
        this.isFocus = false;
        this.isComposing = false;
        this.isCompatibleMode = false;
        this.selection = new selection_1.default(this);
        this.cmd = new command_1.default(this);
        this.txt = new index_1.default(this);
        this.menus = new index_2.default(this);
        this.zIndex = new z_index_1.default();
        this.change = new index_3.default(this);
        this.history = new index_4.default(this);
        var _a = disable_1.default(this), disable = _a.disable, enable = _a.enable;
        this.disable = disable;
        this.enable = enable;
        this.isEnable = true;
    }
    /**
     * 初始化选区
     * @param newLine 新建一行
     */
    Editor.prototype.initSelection = function (newLine) {
        init_selection_1.default(this, newLine);
    };
    /**
     * 创建编辑器实例
     */
    Editor.prototype.create = function () {
        // 初始化 ZIndex
        this.zIndex.init(this);
        // 确定当前的历史记录模式
        this.isCompatibleMode = this.config.compatibleMode();
        // 标准模式下，重置延迟时间
        if (!this.isCompatibleMode) {
            this.config.onchangeTimeout = 30;
        }
        // 国际化 因为要在创建菜单前使用 所以要最先 初始化
        i18next_init_1.default(this);
        // 初始化 DOM
        init_dom_1.default(this);
        // 初始化 text
        this.txt.init();
        // 初始化菜单
        this.menus.init();
        // 初始化全屏功能
        set_full_screen_1.default(this);
        // 初始化选区，将光标定位到内容尾部
        this.initSelection(true);
        // 绑定事件
        bind_event_1.default(this);
        // 绑定监听的目标节点
        this.change.observe();
        this.history.observe();
        // 初始化插件
        plugins_1.default(this);
    };
    /**
     * 提供给用户添加销毁前的钩子函数
     * @param fn 钩子函数
     */
    Editor.prototype.beforeDestroy = function (fn) {
        this.beforeDestroyHooks.push(fn);
        return this;
    };
    /**
     * 销毁当前编辑器实例
     */
    Editor.prototype.destroy = function () {
        var _this = this;
        // 调用钩子函数
        this.beforeDestroyHooks.forEach(function (fn) { return fn.call(_this); });
        // 销毁 DOM 节点
        this.$toolbarElem.remove();
        this.$textContainerElem.remove();
    };
    /**
     * 将编辑器设置为全屏
     */
    Editor.prototype.fullScreen = function () {
        set_full_screen_1.setFullScreen(this);
    };
    /**
     * 将编辑器退出全屏
     */
    Editor.prototype.unFullScreen = function () {
        set_full_screen_1.setUnFullScreen(this);
    };
    /**
     * 滚动到指定标题锚点
     * @param id 标题锚点id
     */
    Editor.prototype.scrollToHead = function (id) {
        scroll_to_head_1.default(this, id);
    };
    /**
     * 自定义添加菜单
     * @param key 菜单 key
     * @param Menu 菜单构造函数
     */
    Editor.registerMenu = function (key, Menu) {
        if (!Menu || typeof Menu !== 'function')
            return;
        Editor.globalCustomMenuConstructorList[key] = Menu;
    };
    /**
     * 自定义添加插件
     * @param { string } name 插件的名称
     * @param { RegisterOptions } options 插件的选项
     */
    Editor.prototype.registerPlugin = function (name, options) {
        plugins_1.registerPlugin(name, options, this.pluginsFunctionList);
    };
    /**
     * 自定义添加插件
     * @param { string } name 插件的名称
     * @param { RegisterOptions } options 插件的选项
     */
    Editor.registerPlugin = function (name, options) {
        plugins_1.registerPlugin(name, options, Editor.globalPluginsFunctionList);
    };
    // 暴露 $
    Editor.$ = dom_core_1.default;
    Editor.BtnMenu = BtnMenu_1.default;
    Editor.DropList = DropList_1.default;
    Editor.DropListMenu = DropListMenu_1.default;
    Editor.Panel = Panel_1.default;
    Editor.PanelMenu = PanelMenu_1.default;
    Editor.Tooltip = Tooltip_1.default;
    Editor.globalCustomMenuConstructorList = {};
    Editor.globalPluginsFunctionList = {};
    return Editor;
}());
exports.default = Editor;
//# sourceMappingURL=index.js.map