"use strict";
/**
 * @description 拖拽上传图片
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var upload_img_1 = tslib_1.__importDefault(require("../upload-img"));
function bindDropImg(editor) {
    /**
     * 拖拽图片的事件
     * @param e 事件参数
     */
    function dropImgHandler(e) {
        var files = e.dataTransfer && e.dataTransfer.files;
        if (!files || !files.length) {
            return;
        }
        // 上传图片
        var uploadImg = new upload_img_1.default(editor);
        uploadImg.uploadImg(files);
    }
    // 绑定 drop 事件
    editor.txt.eventHooks.dropEvents.push(dropImgHandler);
}
exports.default = bindDropImg;
//# sourceMappingURL=drop-img.js.map