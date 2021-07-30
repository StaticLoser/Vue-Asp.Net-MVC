"use strict";
/**
 * @description 封装 document.execCommand
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../utils/dom-core"));
var Command = /** @class */ (function () {
    function Command(editor) {
        this.editor = editor;
    }
    /**
     * 执行富文本操作的命令
     * @param name name
     * @param value value
     */
    Command.prototype.do = function (name, value) {
        var editor = this.editor;
        if (editor.config.styleWithCSS) {
            document.execCommand('styleWithCSS', false, 'true');
        }
        var selection = editor.selection;
        // 如果无选区，忽略
        if (!selection.getRange()) {
            return;
        }
        // 恢复选取
        selection.restoreSelection();
        // 执行
        switch (name) {
            case 'insertHTML':
                this.insertHTML(value);
                break;
            case 'insertElem':
                this.insertElem(value);
                break;
            default:
                // 默认 command
                this.execCommand(name, value);
                break;
        }
        // 修改菜单状态
        editor.menus.changeActive();
        // 最后，恢复选取保证光标在原来的位置闪烁
        selection.saveRange();
        selection.restoreSelection();
    };
    /**
     * 插入 html
     * @param html html 字符串
     */
    Command.prototype.insertHTML = function (html) {
        var editor = this.editor;
        var range = editor.selection.getRange();
        if (range == null)
            return;
        if (this.queryCommandSupported('insertHTML')) {
            // W3C
            this.execCommand('insertHTML', html);
        }
        else if (range.insertNode) {
            // IE
            range.deleteContents();
            if (dom_core_1.default(html).elems.length > 0) {
                range.insertNode(dom_core_1.default(html).elems[0]);
            }
            else {
                var newNode = document.createElement('p');
                newNode.appendChild(document.createTextNode(html));
                range.insertNode(newNode);
            }
            editor.selection.collapseRange();
        }
        // else if (range.pasteHTML) {
        //     // IE <= 10
        //     range.pasteHTML(html)
        // }
    };
    /**
     * 插入 DOM 元素
     * @param $elem DOM 元素
     */
    Command.prototype.insertElem = function ($elem) {
        var editor = this.editor;
        var range = editor.selection.getRange();
        if (range == null)
            return;
        if (range.insertNode) {
            range.deleteContents();
            range.insertNode($elem.elems[0]);
        }
    };
    /**
     * 执行 document.execCommand
     * @param name name
     * @param value value
     */
    Command.prototype.execCommand = function (name, value) {
        document.execCommand(name, false, value);
    };
    /**
     * 执行 document.queryCommandValue
     * @param name name
     */
    Command.prototype.queryCommandValue = function (name) {
        return document.queryCommandValue(name);
    };
    /**
     * 执行 document.queryCommandState
     * @param name name
     */
    Command.prototype.queryCommandState = function (name) {
        return document.queryCommandState(name);
    };
    /**
     * 执行 document.queryCommandSupported
     * @param name name
     */
    Command.prototype.queryCommandSupported = function (name) {
        return document.queryCommandSupported(name);
    };
    return Command;
}());
exports.default = Command;
//# sourceMappingURL=command.js.map