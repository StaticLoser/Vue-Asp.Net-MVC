"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chain_1 = require("../../../../utils/data-structure/chain");
var HtmlCache = /** @class */ (function () {
    function HtmlCache(editor) {
        this.editor = editor;
        this.data = new chain_1.TailChain();
    }
    /**
     * 初始化绑定
     */
    HtmlCache.prototype.observe = function () {
        this.data.resetMax(this.editor.config.historyMaxSize);
        // 保存初始化值
        this.data.insertLast(this.editor.$textElem.html());
    };
    /**
     * 保存
     */
    HtmlCache.prototype.save = function () {
        this.data.insertLast(this.editor.$textElem.html());
        return this;
    };
    /**
     * 撤销
     */
    HtmlCache.prototype.revoke = function () {
        var data = this.data.prev();
        if (data) {
            this.editor.$textElem.html(data);
            return true;
        }
        return false;
    };
    /**
     * 恢复
     */
    HtmlCache.prototype.restore = function () {
        var data = this.data.next();
        if (data) {
            this.editor.$textElem.html(data);
            return true;
        }
        return false;
    };
    return HtmlCache;
}());
exports.default = HtmlCache;
//# sourceMappingURL=index.js.map