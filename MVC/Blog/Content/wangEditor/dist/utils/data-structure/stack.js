"use strict";
/**
 * @description 数据结构 - 栈
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CeilStack = void 0;
/**
 * 栈（限制最大数据条数，栈满后可以继续入栈，而先入栈的数据将失效）
 */
// 取名灵感来自 Math.ceil，向上取有效值
var CeilStack = /** @class */ (function () {
    function CeilStack(max) {
        if (max === void 0) { max = 0; }
        /**
         * 数据缓存
         */
        this.data = [];
        /**
         * 栈的最大长度。为零则长度不限
         */
        this.max = 0;
        /**
         * 标识是否重设过 max 值
         */
        this.reset = false;
        max = Math.abs(max);
        max && (this.max = max);
    }
    /**
     * 允许用户重设一次 max 值
     */
    CeilStack.prototype.resetMax = function (maxSize) {
        maxSize = Math.abs(maxSize);
        if (!this.reset && !isNaN(maxSize)) {
            this.max = maxSize;
            this.reset = true;
        }
    };
    Object.defineProperty(CeilStack.prototype, "size", {
        /**
         * 当前栈中的数据条数
         */
        get: function () {
            return this.data.length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 入栈
     * @param data 入栈的数据
     */
    CeilStack.prototype.instack = function (data) {
        this.data.unshift(data);
        if (this.max && this.size > this.max) {
            this.data.length = this.max;
        }
        return this;
    };
    /**
     * 出栈
     */
    CeilStack.prototype.outstack = function () {
        return this.data.shift();
    };
    /**
     * 清空栈
     */
    CeilStack.prototype.clear = function () {
        this.data.length = 0;
        return this;
    };
    return CeilStack;
}());
exports.CeilStack = CeilStack;
//# sourceMappingURL=stack.js.map