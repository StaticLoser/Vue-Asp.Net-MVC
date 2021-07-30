"use strict";
/**
 * @description 上传进度条
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var Progress = /** @class */ (function () {
    function Progress(editor) {
        this.editor = editor;
        this.$textContainer = editor.$textContainerElem;
        this.$bar = dom_core_1.default('<div class="w-e-progress"></div>');
        this.isShow = false;
        this.time = 0;
        this.timeoutId = 0;
    }
    /**
     * 显示进度条
     * @param progress 进度百分比
     */
    Progress.prototype.show = function (progress) {
        var _this = this;
        // 不要重新显示
        if (this.isShow) {
            return;
        }
        this.isShow = true;
        // 渲染 $bar
        var $bar = this.$bar;
        var $textContainer = this.$textContainer;
        $textContainer.append($bar);
        // 改变进度条（防抖，100ms 渲染一次）
        if (Date.now() - this.time > 100) {
            if (progress <= 1) {
                $bar.css('width', progress * 100 + '%');
                this.time = Date.now();
            }
        }
        // 500ms 之后隐藏
        var timeoutId = this.timeoutId;
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        this.timeoutId = window.setTimeout(function () {
            _this.hide();
        }, 500);
    };
    /**
     * 隐藏
     */
    Progress.prototype.hide = function () {
        var $bar = this.$bar;
        $bar.remove();
        this.isShow = false;
        this.time = 0;
        this.timeoutId = 0;
    };
    return Progress;
}());
exports.default = Progress;
//# sourceMappingURL=progress.js.map