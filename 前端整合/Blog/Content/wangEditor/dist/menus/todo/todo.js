"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todo = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var todo = /** @class */ (function () {
    function todo($orginElem) {
        var _a;
        this.template = "<ul class=\"w-e-todo\"><li><span contenteditable=\"false\"><input type=\"checkbox\"></span></li></ul>";
        this.checked = false;
        this.$todo = dom_core_1.default(this.template);
        this.$child = (_a = $orginElem === null || $orginElem === void 0 ? void 0 : $orginElem.childNodes()) === null || _a === void 0 ? void 0 : _a.clone(true);
    }
    todo.prototype.init = function () {
        var $child = this.$child;
        var $inputContainer = this.getInputContainer();
        if ($child) {
            $child.insertAfter($inputContainer);
        }
    };
    todo.prototype.getInput = function () {
        var $todo = this.$todo;
        var $input = $todo.find('input');
        return $input;
    };
    todo.prototype.getInputContainer = function () {
        var $inputContainer = this.getInput().parent();
        return $inputContainer;
    };
    todo.prototype.getTodo = function () {
        return this.$todo;
    };
    return todo;
}());
exports.todo = todo;
function createTodo($orginElem) {
    var t = new todo($orginElem);
    t.init();
    return t;
}
exports.default = createTodo;
//# sourceMappingURL=todo.js.map