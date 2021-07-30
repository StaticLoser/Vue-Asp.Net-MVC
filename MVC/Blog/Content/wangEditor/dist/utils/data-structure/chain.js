"use strict";
/**
 * @description 数据结构 - 链表
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TailChain = void 0;
/**
 * 特殊链表（数据尾插入、插入前自动清理指针后边的数据、插入后指针永远定位于最后一位元素、可限制链表长度、指针双向移动）
 */
var TailChain = /** @class */ (function () {
    function TailChain() {
        /**
         * 链表数据
         */
        this.data = [];
        /**
         * 链表最大长度，零表示长度不限
         */
        this.max = 0;
        /**
         * 指针
         */
        this.point = 0;
        // 当前指针是否人为操作过
        this.isRe = false;
    }
    /**
     * 允许用户重设一次 max 值
     */
    TailChain.prototype.resetMax = function (maxSize) {
        maxSize = Math.abs(maxSize);
        maxSize && (this.max = maxSize);
    };
    Object.defineProperty(TailChain.prototype, "size", {
        /**
         * 当前链表的长度
         */
        get: function () {
            return this.data.length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 尾插入
     * @param data 插入的数据
     */
    TailChain.prototype.insertLast = function (data) {
        // 人为操作过指针，清除指针后面的元素
        if (this.isRe) {
            this.data.splice(this.point + 1);
            this.isRe = false;
        }
        this.data.push(data);
        // 超出链表最大长度
        while (this.max && this.size > this.max) {
            this.data.shift();
        }
        // 从新定位指针到最后一个元素
        this.point = this.size - 1;
        return this;
    };
    /**
     * 获取当前指针元素
     */
    TailChain.prototype.current = function () {
        return this.data[this.point];
    };
    /**
     * 获取上一指针元素
     */
    TailChain.prototype.prev = function () {
        !this.isRe && (this.isRe = true);
        this.point--;
        if (this.point < 0) {
            this.point = 0;
            return undefined;
        }
        return this.current();
    };
    /**
     * 下一指针元素
     */
    TailChain.prototype.next = function () {
        !this.isRe && (this.isRe = true);
        this.point++;
        if (this.point >= this.size) {
            this.point = this.size - 1;
            return undefined;
        }
        return this.current();
    };
    return TailChain;
}());
exports.TailChain = TailChain;
//# sourceMappingURL=chain.js.map