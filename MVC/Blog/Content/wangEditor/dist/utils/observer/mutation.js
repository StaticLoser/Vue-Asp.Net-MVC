"use strict";
/**
 * @description 封装 MutationObserver
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 封装 MutationObserver，抽离成公共类
 */
var Mutation = /** @class */ (function () {
    /**
     * 构造器
     * @param fn 发生变化时执行的回调函数
     * @param options 自定义配置项
     */
    function Mutation(fn, options) {
        var _this = this;
        /**
         * 默认的 MutationObserverInit 配置
         */
        this.options = {
            subtree: true,
            childList: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
        };
        this.callback = function (mutations) {
            fn(mutations, _this);
        };
        this.observer = new MutationObserver(this.callback);
        options && (this.options = options);
    }
    Object.defineProperty(Mutation.prototype, "target", {
        get: function () {
            return this.node;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 绑定监听节点（初次绑定有效）
     * @param node 需要被监听的节点
     */
    Mutation.prototype.observe = function (node) {
        if (!(this.node instanceof Node)) {
            this.node = node;
            this.connect();
        }
    };
    /**
     * 连接监听器（开始观察）
     */
    Mutation.prototype.connect = function () {
        if (this.node) {
            this.observer.observe(this.node, this.options);
            return this;
        }
        throw new Error('还未初始化绑定，请您先绑定有效的 Node 节点');
    };
    /**
     * 断开监听器（停止观察）
     */
    Mutation.prototype.disconnect = function () {
        var list = this.observer.takeRecords();
        list.length && this.callback(list);
        this.observer.disconnect();
    };
    return Mutation;
}());
exports.default = Mutation;
//# sourceMappingURL=mutation.js.map