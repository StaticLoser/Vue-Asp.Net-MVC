"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var style_1 = tslib_1.__importDefault(require("../../config/style"));
var tier = {
    menu: 2,
    panel: 2,
    toolbar: 1,
    tooltip: 1,
    textContainer: 1,
};
var ZIndex = /** @class */ (function () {
    function ZIndex() {
        // 层级参数
        this.tier = tier;
        // 默认值
        this.baseZIndex = style_1.default.zIndex;
    }
    // 获取 tierName 对应的 z-index 的值。如果 tierName 未定义则返回默认的 z-index 值
    ZIndex.prototype.get = function (tierName) {
        if (tierName && this.tier[tierName]) {
            return this.baseZIndex + this.tier[tierName];
        }
        return this.baseZIndex;
    };
    // 初始化
    ZIndex.prototype.init = function (editor) {
        if (this.baseZIndex == style_1.default.zIndex) {
            this.baseZIndex = editor.config.zIndex;
        }
    };
    return ZIndex;
}());
exports.default = ZIndex;
//# sourceMappingURL=index.js.map