"use strict";
/**
 * @description 记录 scrollTop
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cache_1 = tslib_1.__importDefault(require("../../../../utils/data-structure/cache"));
var ScrollCache = /** @class */ (function (_super) {
    tslib_1.__extends(ScrollCache, _super);
    function ScrollCache(editor) {
        var _this = _super.call(this, editor.config.historyMaxSize) || this;
        _this.editor = editor;
        /**
         * 上一次的 scrollTop
         */
        _this.last = 0;
        _this.target = editor.$textElem.elems[0];
        return _this;
    }
    /**
     * 给编辑区容器绑定 scroll 事件
     */
    ScrollCache.prototype.observe = function () {
        var _this = this;
        this.target = this.editor.$textElem.elems[0];
        this.editor.$textElem.on('scroll', function () {
            _this.last = _this.target.scrollTop;
        });
        this.resetMaxSize(this.editor.config.historyMaxSize);
    };
    /**
     * 保存 scrollTop 值
     */
    ScrollCache.prototype.save = function () {
        _super.prototype.save.call(this, [this.last, this.target.scrollTop]);
        return this;
    };
    /**
     * 撤销
     */
    ScrollCache.prototype.revoke = function () {
        var _this = this;
        return _super.prototype.revoke.call(this, function (data) {
            _this.target.scrollTop = data[0];
        });
    };
    /**
     * 恢复
     */
    ScrollCache.prototype.restore = function () {
        var _this = this;
        return _super.prototype.restore.call(this, function (data) {
            _this.target.scrollTop = data[1];
        });
    };
    return ScrollCache;
}(cache_1.default));
exports.default = ScrollCache;
//# sourceMappingURL=index.js.map