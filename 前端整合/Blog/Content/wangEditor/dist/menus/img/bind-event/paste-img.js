"use strict";
/**
 * @description 粘贴图片
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var paste_event_1 = require("../../../text/paste/paste-event");
var upload_img_1 = tslib_1.__importDefault(require("../upload-img"));
/**
 * 剪切板是否有 text 或者 html ？
 * @param editor 编辑器对象
 * @param e 粘贴事件参数
 */
function _haveTextOrHtml(editor, e) {
    var config = editor.config;
    var pasteFilterStyle = config.pasteFilterStyle;
    var pasteIgnoreImg = config.pasteIgnoreImg;
    var pasteHtml = paste_event_1.getPasteHtml(e, pasteFilterStyle, pasteIgnoreImg);
    if (pasteHtml)
        return true;
    var pasteText = paste_event_1.getPasteText(e);
    if (pasteText)
        return true;
    return false; // text html 都没有，则返回 false
}
/**
 * 剪切板是否有 Files
 * @param editor 编辑器对象
 * @param e 粘贴事件参数
 */
function _haveFiles(editor, e) {
    var _a;
    var types = ((_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.types) || [];
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        if (type === 'Files') {
            return true;
        }
    }
    return false;
}
/**
 * 粘贴图片事件方法
 * @param e 事件参数
 */
function pasteImgHandler(e, editor) {
    // 粘贴过来的没有 file 时，判断 text 或者 html
    if (!_haveFiles(editor, e)) {
        if (_haveTextOrHtml(editor, e)) {
            // 粘贴过来的有 text 或者 html ，则不执行粘贴图片逻辑
            return;
        }
    }
    // 获取粘贴的图片列表
    var pastedFiles = paste_event_1.getPasteImgs(e);
    if (!pastedFiles.length) {
        return;
    }
    // code 中忽略（暂不管它）
    // 执行上传
    var uploadImg = new upload_img_1.default(editor);
    uploadImg.uploadImg(pastedFiles);
}
/**
 * 粘贴图片
 * @param editor 编辑器对象
 * @param pasteEvents 粘贴事件列表
 */
function bindPasteImg(editor) {
    /**
     * 绑定 paste 事件
     * 这里使用了unshift，以前是push
     * 在以前的流程中，pasteImgHandler触发之前，会调用到window.getSelection().removeAllRanges()
     * 会导致性能变差。在编辑器中粘贴，粘贴耗时多了100+ms，根本原因未知
     * 最小复现demo，在div内粘贴图片就可以看到getData耗时异常得长
     * <html>
     *     <div id="a" contenteditable="true"></div>
     *     <script>
     *         const div = document.getElementById('a')
     *         div.addEventListener('paste', (e) => {
     *             window.getSelection().removeAllRanges()
     *             e.clipboardData.getData('text/html')
     *         })
     *     </script>
     * </html>
     * 因此改成unshift，先触发pasteImgHandler就不会有性能问题
     */
    editor.txt.eventHooks.pasteEvents.unshift(function (e) {
        pasteImgHandler(e, editor);
    });
}
exports.default = bindPasteImg;
//# sourceMappingURL=paste-img.js.map