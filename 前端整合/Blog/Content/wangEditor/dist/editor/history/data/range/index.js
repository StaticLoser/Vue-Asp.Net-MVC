"use strict";
/**
 * @description 记录 range 变化
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var cache_1 = tslib_1.__importDefault(require("../../../../utils/data-structure/cache"));
var dom_core_1 = tslib_1.__importDefault(require("../../../../utils/dom-core"));
var util_1 = require("../../../../utils/util");
/**
 * 把 Range 对象转换成缓存对象
 * @param range Range 对象
 */
function rangeToObject(range) {
    return {
        start: [range.startContainer, range.startOffset],
        end: [range.endContainer, range.endOffset],
        root: range.commonAncestorContainer,
        collapsed: range.collapsed,
    };
}
/**
 * 编辑区 range 缓存管理器
 */
var RangeCache = /** @class */ (function (_super) {
    tslib_1.__extends(RangeCache, _super);
    function RangeCache(editor) {
        var _this = _super.call(this, editor.config.historyMaxSize) || this;
        _this.editor = editor;
        _this.lastRange = rangeToObject(document.createRange());
        _this.root = editor.$textElem.elems[0];
        _this.updateLastRange = util_1.debounce(function () {
            _this.lastRange = rangeToObject(_this.rangeHandle);
        }, editor.config.onchangeTimeout);
        return _this;
    }
    Object.defineProperty(RangeCache.prototype, "rangeHandle", {
        /**
         * 获取 Range 对象
         */
        get: function () {
            var selection = document.getSelection();
            return selection && selection.rangeCount ? selection.getRangeAt(0) : document.createRange();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 初始化绑定
     */
    RangeCache.prototype.observe = function () {
        var self = this;
        // 同步节点数据
        this.root = this.editor.$textElem.elems[0];
        this.resetMaxSize(this.editor.config.historyMaxSize);
        // selection change 回调函数
        function selectionchange() {
            var handle = self.rangeHandle;
            if (self.root === handle.commonAncestorContainer ||
                self.root.contains(handle.commonAncestorContainer)) {
                // 非中文输入状态下才进行记录
                if (!self.editor.isComposing) {
                    self.updateLastRange();
                }
            }
        }
        // backspace 和 delete 手动更新 Range 缓存
        function deletecallback(e) {
            if (e.key == 'Backspace' || e.key == 'Delete') {
                // self.lastRange = rangeToObject(self.rangeHandle)
                self.updateLastRange();
            }
        }
        // 绑定事件（必须绑定在 document 上，不能绑定在 window 上）
        dom_core_1.default(document).on('selectionchange', selectionchange);
        // 解除事件绑定
        this.editor.beforeDestroy(function () {
            dom_core_1.default(document).off('selectionchange', selectionchange);
        });
        // 删除文本时手动更新 range
        self.editor.$textElem.on('keydown', deletecallback);
    };
    /**
     * 保存 Range
     */
    RangeCache.prototype.save = function () {
        var current = rangeToObject(this.rangeHandle);
        _super.prototype.save.call(this, [this.lastRange, current]);
        this.lastRange = current;
        return this;
    };
    /**
     * 设置 Range，在 撤销/恢复 中调用
     * @param range 缓存的 Range 数据
     */
    RangeCache.prototype.set = function (range) {
        try {
            if (range) {
                var handle = this.rangeHandle;
                handle.setStart.apply(handle, range.start);
                handle.setEnd.apply(handle, range.end);
                this.editor.menus.changeActive();
                return true;
            }
        }
        catch (err) {
            return false;
        }
        return false;
    };
    /**
     * 撤销
     */
    RangeCache.prototype.revoke = function () {
        var _this = this;
        return _super.prototype.revoke.call(this, function (data) {
            _this.set(data[0]);
        });
    };
    /**
     * 恢复
     */
    RangeCache.prototype.restore = function () {
        var _this = this;
        return _super.prototype.restore.call(this, function (data) {
            _this.set(data[1]);
        });
    };
    return RangeCache;
}(cache_1.default));
exports.default = RangeCache;
//# sourceMappingURL=index.js.map