"use strict";
/**
 * @description 差异备份
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cache_1 = tslib_1.__importDefault(require("../../../../utils/data-structure/cache"));
var compile_1 = tslib_1.__importDefault(require("./compile"));
var decompilation_1 = require("./decompilation");
var NodeCache = /** @class */ (function (_super) {
    tslib_1.__extends(NodeCache, _super);
    function NodeCache(editor) {
        var _this = _super.call(this, editor.config.historyMaxSize) || this;
        _this.editor = editor;
        return _this;
    }
    NodeCache.prototype.observe = function () {
        this.resetMaxSize(this.editor.config.historyMaxSize);
    };
    /**
     * 编译并保存数据
     */
    NodeCache.prototype.compile = function (data) {
        this.save(compile_1.default(data));
        return this;
    };
    /**
     * 撤销
     */
    NodeCache.prototype.revoke = function () {
        return _super.prototype.revoke.call(this, function (data) {
            decompilation_1.revoke(data);
        });
    };
    /**
     * 恢复
     */
    NodeCache.prototype.restore = function () {
        return _super.prototype.restore.call(this, function (data) {
            decompilation_1.restore(data);
        });
    };
    return NodeCache;
}(cache_1.default));
exports.default = NodeCache;
//# sourceMappingURL=index.js.map