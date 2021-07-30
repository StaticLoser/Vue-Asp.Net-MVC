"use strict";
/**
 * @description 整合差异备份和内容备份，进行统一管理
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var html_1 = tslib_1.__importDefault(require("./html"));
var ContentCache = /** @class */ (function () {
    function ContentCache(editor) {
        this.editor = editor;
    }
    /**
     * 初始化绑定
     */
    ContentCache.prototype.observe = function () {
        if (this.editor.isCompatibleMode) {
            // 兼容模式（内容备份）
            this.cache = new html_1.default(this.editor);
        }
        else {
            // 标准模式（差异备份/节点备份）
            this.cache = new node_1.default(this.editor);
        }
        this.cache.observe();
    };
    /**
     * 保存
     */
    ContentCache.prototype.save = function (mutations) {
        if (this.editor.isCompatibleMode) {
            ;
            this.cache.save();
        }
        else {
            ;
            this.cache.compile(mutations);
        }
    };
    /**
     * 撤销
     */
    ContentCache.prototype.revoke = function () {
        var _a;
        return (_a = this.cache) === null || _a === void 0 ? void 0 : _a.revoke();
    };
    /**
     * 恢复
     */
    ContentCache.prototype.restore = function () {
        var _a;
        return (_a = this.cache) === null || _a === void 0 ? void 0 : _a.restore();
    };
    return ContentCache;
}());
exports.default = ContentCache;
//# sourceMappingURL=content.js.map