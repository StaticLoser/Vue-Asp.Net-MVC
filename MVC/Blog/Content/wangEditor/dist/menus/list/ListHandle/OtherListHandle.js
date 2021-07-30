"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ListHandle_1 = require("./ListHandle");
var utils_1 = require("../utils");
var OtherListHandle = /** @class */ (function (_super) {
    tslib_1.__extends(OtherListHandle, _super);
    function OtherListHandle(options, range) {
        var _this = _super.call(this, options) || this;
        _this.range = range;
        return _this;
    }
    OtherListHandle.prototype.exec = function () {
        var _a = this.options, editor = _a.editor, listTarget = _a.listTarget;
        // 获取选中的段落
        var $nodes = editor.selection.getSelectionRangeTopNodes();
        // 生成 li 元素并且添加到序列节点后删除原节点
        var $containerFragment = utils_1.createElementFragment(utils_1.filterSelectionNodes($nodes), // 过滤选取的元素
        utils_1.createElement(listTarget) // 创建 序列节点
        );
        // 插入节点到选区
        this.selectionRangeElem.set($containerFragment);
        this.range.insertNode($containerFragment);
    };
    return OtherListHandle;
}(ListHandle_1.ListHandle));
exports.default = OtherListHandle;
//# sourceMappingURL=OtherListHandle.js.map