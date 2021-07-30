"use strict";
/**
 * @description 历史记录
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var content_1 = tslib_1.__importDefault(require("./data/content"));
var scroll_1 = tslib_1.__importDefault(require("./data/scroll"));
var range_1 = tslib_1.__importDefault(require("./data/range"));
/**
 * 历史记录（撤销、恢复）
 */
var History = /** @class */ (function () {
    function History(editor) {
        this.editor = editor;
        this.content = new content_1.default(editor);
        this.scroll = new scroll_1.default(editor);
        this.range = new range_1.default(editor);
    }
    Object.defineProperty(History.prototype, "size", {
        /**
         *  获取缓存中的数据长度。格式为：[正常的数据的条数，被撤销的数据的条数]
         */
        get: function () {
            return this.scroll.size;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 初始化绑定。在 editor.create() 结尾时调用
     */
    History.prototype.observe = function () {
        this.content.observe();
        this.scroll.observe();
        // 标准模式下才进行初始化绑定
        !this.editor.isCompatibleMode && this.range.observe();
    };
    /**
     * 保存数据
     */
    History.prototype.save = function (mutations) {
        if (mutations.length) {
            this.content.save(mutations);
            this.scroll.save();
            // 标准模式下才进行缓存
            !this.editor.isCompatibleMode && this.range.save();
        }
    };
    /**
     * 撤销
     */
    History.prototype.revoke = function () {
        this.editor.change.disconnect();
        var res = this.content.revoke();
        if (res) {
            this.scroll.revoke();
            // 标准模式下才执行
            if (!this.editor.isCompatibleMode) {
                this.range.revoke();
                this.editor.$textElem.focus();
            }
        }
        this.editor.change.connect();
        // 如果用户在 onchange 中修改了内容（DOM），那么缓存中的节点数据可能不连贯了，不连贯的数据必将导致恢复失败，所以必须将用户的 onchange 处于监控状态中
        res && this.editor.change.emit();
    };
    /**
     * 恢复
     */
    History.prototype.restore = function () {
        this.editor.change.disconnect();
        var res = this.content.restore();
        if (res) {
            this.scroll.restore();
            // 标准模式下才执行
            if (!this.editor.isCompatibleMode) {
                this.range.restore();
                this.editor.$textElem.focus();
            }
        }
        this.editor.change.connect();
        // 与 revoke 同理
        res && this.editor.change.emit();
    };
    return History;
}());
exports.default = History;
//# sourceMappingURL=index.js.map