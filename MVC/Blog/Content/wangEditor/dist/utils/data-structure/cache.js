"use strict";
/**
 * @description 双栈实现撤销恢复
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
var stack_1 = require("./stack");
var Cache = /** @class */ (function () {
    function Cache(maxSize) {
        this.maxSize = maxSize;
        /**
         * 上一步操作是否为 撤销/恢复
         */
        this.isRe = false;
        this.data = new stack_1.CeilStack(maxSize);
        this.revokeData = new stack_1.CeilStack(maxSize);
    }
    Object.defineProperty(Cache.prototype, "size", {
        /**
         * 返回当前栈中的数据长度。格式为：[正常的数据的条数，被撤销的数据的条数]
         */
        get: function () {
            return [this.data.size, this.revokeData.size];
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 重设数据缓存器的缓存长度（第一次有效）
     */
    Cache.prototype.resetMaxSize = function (maxSize) {
        this.data.resetMax(maxSize);
        this.revokeData.resetMax(maxSize);
    };
    /**
     * 保存数据
     */
    Cache.prototype.save = function (data) {
        if (this.isRe) {
            this.revokeData.clear();
            this.isRe = false;
        }
        this.data.instack(data);
        return this;
    };
    /**
     * 撤销
     * @param fn 撤销时，如果有数据，执行的回调函数
     */
    Cache.prototype.revoke = function (fn) {
        !this.isRe && (this.isRe = true);
        var data = this.data.outstack();
        if (data) {
            this.revokeData.instack(data);
            fn(data);
            return true;
        }
        return false;
    };
    /**
     * 恢复
     * @param fn 恢复时，如果有数据，执行的回调函数
     */
    Cache.prototype.restore = function (fn) {
        !this.isRe && (this.isRe = true);
        var data = this.revokeData.outstack();
        if (data) {
            this.data.instack(data);
            fn(data);
            return true;
        }
        return false;
    };
    return Cache;
}());
exports.default = Cache;
//# sourceMappingURL=cache.js.map