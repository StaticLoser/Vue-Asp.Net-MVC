"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var BtnMenu_1 = tslib_1.__importDefault(require("../menu-constructors/BtnMenu"));
var util_1 = require("./util");
var bind_event_1 = tslib_1.__importDefault(require("./bind-event"));
var todo_1 = tslib_1.__importDefault(require("./todo"));
var Todo = /** @class */ (function (_super) {
    tslib_1.__extends(Todo, _super);
    function Todo(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u5F85\u529E\u4E8B\u9879\">\n                    <i class=\"w-e-icon-checkbox-checked\"></i>\n                </div>");
        _this = _super.call(this, $elem, editor) || this;
        bind_event_1.default(editor);
        return _this;
    }
    /**
     * 点击事件
     */
    Todo.prototype.clickHandler = function () {
        var editor = this.editor;
        if (!util_1.isAllTodo(editor)) {
            // 设置todolist
            this.setTodo();
        }
        else {
            // 取消设置todolist
            this.cancelTodo();
            this.tryChangeActive();
        }
    };
    Todo.prototype.tryChangeActive = function () {
        if (util_1.isAllTodo(this.editor)) {
            this.active();
        }
        else {
            this.unActive();
        }
    };
    /**
     * 设置todo
     */
    Todo.prototype.setTodo = function () {
        var editor = this.editor;
        var topNodeElem = editor.selection.getSelectionRangeTopNodes();
        topNodeElem.forEach(function ($node) {
            var _a;
            var nodeName = $node === null || $node === void 0 ? void 0 : $node.getNodeName();
            if (nodeName === 'P') {
                var todo = todo_1.default($node);
                var todoNode = todo.getTodo();
                var child = (_a = todoNode.children()) === null || _a === void 0 ? void 0 : _a.getNode();
                todoNode.insertAfter($node);
                editor.selection.moveCursor(child);
                $node.remove();
            }
        });
        this.tryChangeActive();
    };
    /**
     * 取消设置todo
     */
    Todo.prototype.cancelTodo = function () {
        var editor = this.editor;
        var $topNodeElems = editor.selection.getSelectionRangeTopNodes();
        $topNodeElems.forEach(function ($topNodeElem) {
            var _a, _b, _c;
            var content = (_b = (_a = $topNodeElem.childNodes()) === null || _a === void 0 ? void 0 : _a.childNodes()) === null || _b === void 0 ? void 0 : _b.clone(true);
            var $p = dom_core_1.default("<p></p>");
            $p.append(content);
            $p.insertAfter($topNodeElem);
            // 移除input
            (_c = $p.childNodes()) === null || _c === void 0 ? void 0 : _c.get(0).remove();
            editor.selection.moveCursor($p.getNode());
            $topNodeElem.remove();
        });
    };
    return Todo;
}(BtnMenu_1.default));
exports.default = Todo;
//# sourceMappingURL=index.js.map