"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @description 分割线
 * @author wangqiaoling
 */
var BtnMenu_1 = tslib_1.__importDefault(require("../menu-constructors/BtnMenu"));
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var index_1 = tslib_1.__importDefault(require("./bind-event/index"));
var util_1 = require("../../utils/util");
var const_1 = require("../../utils/const");
var splitLine = /** @class */ (function (_super) {
    tslib_1.__extends(splitLine, _super);
    function splitLine(editor) {
        var _this = this;
        var $elem = dom_core_1.default('<div class="w-e-menu" data-title="分割线"><i class="w-e-icon-split-line"></i></div>');
        _this = _super.call(this, $elem, editor) || this;
        // 绑定事件
        index_1.default(editor);
        return _this;
    }
    /**
     * 菜单点击事件
     */
    splitLine.prototype.clickHandler = function () {
        var editor = this.editor;
        var range = editor.selection.getRange();
        var $selectionElem = editor.selection.getSelectionContainerElem();
        if (!($selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.length))
            return;
        var $DomElement = dom_core_1.default($selectionElem.elems[0]);
        var $tableDOM = $DomElement.parentUntil('TABLE', $selectionElem.elems[0]);
        var $imgDOM = $DomElement.children();
        // 禁止在代码块中添加分割线
        if ($DomElement.getNodeName() === 'CODE')
            return;
        // 禁止在表格中添加分割线
        if ($tableDOM && dom_core_1.default($tableDOM.elems[0]).getNodeName() === 'TABLE')
            return;
        // 禁止在图片处添加分割线
        if ($imgDOM &&
            $imgDOM.length !== 0 &&
            dom_core_1.default($imgDOM.elems[0]).getNodeName() === 'IMG' &&
            !(range === null || range === void 0 ? void 0 : range.collapsed) // 处理光标在 img 后面的情况
        ) {
            return;
        }
        this.createSplitLine();
    };
    /**
     * 创建 splitLine
     */
    splitLine.prototype.createSplitLine = function () {
        // 防止插入分割线时没有占位元素的尴尬
        var splitLineDOM = "<hr/>" + const_1.EMPTY_P;
        // 火狐浏览器不需要br标签占位
        if (util_1.UA.isFirefox) {
            splitLineDOM = '<hr/><p></p>';
        }
        this.editor.cmd.do('insertHTML', splitLineDOM);
    };
    /**
     * 尝试修改菜单激活状态
     */
    splitLine.prototype.tryChangeActive = function () { };
    return splitLine;
}(BtnMenu_1.default));
exports.default = splitLine;
//# sourceMappingURL=index.js.map