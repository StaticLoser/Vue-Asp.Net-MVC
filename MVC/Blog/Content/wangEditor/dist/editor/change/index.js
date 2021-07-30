"use strict";
/**
 * @description 编辑器 change 事件
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mutation_1 = tslib_1.__importDefault(require("../../utils/observer/mutation"));
var util_1 = require("../../utils/util");
var const_1 = require("../../utils/const");
/**
 * 剔除编辑区容器的 attribute 变化中的非 contenteditable 变化
 * @param mutations MutationRecord[]
 * @param tar 编辑区容器的 DOM 节点
 */
function mutationsFilter(mutations, tar) {
    // 剔除编辑区容器的 attribute 变化中的非 contenteditable 变化
    return mutations.filter(function (_a) {
        var type = _a.type, target = _a.target, attributeName = _a.attributeName;
        return (type != 'attributes' ||
            (type == 'attributes' && (attributeName == 'contenteditable' || target != tar)));
    });
}
/**
 * Change 实现
 */
var Change = /** @class */ (function (_super) {
    tslib_1.__extends(Change, _super);
    function Change(editor) {
        var _this = _super.call(this, function (mutations, observer) {
            var _a;
            // 数据过滤
            mutations = mutationsFilter(mutations, observer.target);
            // 存储数据
            (_a = _this.data).push.apply(_a, mutations);
            // 标准模式下
            if (!editor.isCompatibleMode) {
                // 在非中文输入状态下时才保存数据
                if (!editor.isComposing) {
                    return _this.asyncSave();
                }
            }
            // 兼容模式下
            else {
                _this.asyncSave();
            }
        }) || this;
        _this.editor = editor;
        /**
         * 变化的数据集合
         */
        _this.data = [];
        /**
         * 异步保存数据
         */
        _this.asyncSave = const_1.EMPTY_FN;
        return _this;
    }
    /**
     * 保存变化的数据并发布 change event
     */
    Change.prototype.save = function () {
        // 有数据
        if (this.data.length) {
            // 保存变化数据
            this.editor.history.save(this.data);
            // 清除缓存
            this.data.length = 0;
            this.emit();
        }
    };
    /**
     * 发布 change event
     */
    Change.prototype.emit = function () {
        // 执行 onchange 回调
        this.editor.txt.eventHooks.changeEvents.forEach(function (fn) { return fn(); });
    };
    // 重写 observe
    Change.prototype.observe = function () {
        var _this = this;
        _super.prototype.observe.call(this, this.editor.$textElem.elems[0]);
        var timeout = this.editor.config.onchangeTimeout;
        this.asyncSave = util_1.debounce(function () {
            _this.save();
        }, timeout);
        if (!this.editor.isCompatibleMode) {
            this.editor.$textElem.on('compositionend', function () {
                _this.asyncSave();
            });
        }
    };
    return Change;
}(mutation_1.default));
exports.default = Change;
//# sourceMappingURL=index.js.map