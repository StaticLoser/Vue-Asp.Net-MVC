"use strict";
/**
 * @description 处理粘贴逻辑
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasteImgs = exports.getPasteHtml = exports.getPasteText = void 0;
var tslib_1 = require("tslib");
var util_1 = require("../../utils/util");
var parse_html_1 = tslib_1.__importDefault(require("./parse-html"));
/**
 * 获取粘贴的纯文本
 * @param e Event 参数
 */
function getPasteText(e) {
    // const clipboardData = e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)
    var clipboardData = e.clipboardData; // 暂不考虑 originalEvent 的情况
    var pasteText = '';
    if (clipboardData == null) {
        pasteText = window.clipboardData && window.clipboardData.getData('text');
    }
    else {
        pasteText = clipboardData.getData('text/plain');
    }
    return util_1.replaceHtmlSymbol(pasteText);
}
exports.getPasteText = getPasteText;
/**
 * 获取粘贴的 html 字符串
 * @param e Event 参数
 * @param filterStyle 是否过滤 style 样式
 * @param ignoreImg 是否忽略 img 标签
 */
function getPasteHtml(e, filterStyle, ignoreImg) {
    if (filterStyle === void 0) { filterStyle = true; }
    if (ignoreImg === void 0) { ignoreImg = false; }
    var clipboardData = e.clipboardData; // 暂不考虑 originalEvent 的情况
    var pasteHtml = '';
    if (clipboardData) {
        pasteHtml = clipboardData.getData('text/html');
    }
    // 无法通过 'text/html' 格式获取 html，则尝试获取 text
    if (!pasteHtml) {
        var text = getPasteText(e);
        if (!text) {
            return ''; // 没有找到任何文字，则返回
        }
        pasteHtml = "<p>" + text + "</p>";
    }
    // 转译<1，后面跟数字的转译成 &lt;1
    pasteHtml = pasteHtml.replace(/<(\d)/gm, function (_, num) { return '&lt;' + num; });
    // pdf复制只会有一个meta标签，parseHtml中的过滤meta标签会导致后面内容丢失
    pasteHtml = pasteHtml.replace(/<meta.*charset=("|').*("|').*?>/gim, '');
    // 剔除多余的标签、属性
    pasteHtml = parse_html_1.default(pasteHtml, filterStyle, ignoreImg);
    return pasteHtml;
}
exports.getPasteHtml = getPasteHtml;
/**
 * 获取粘贴的图片文件
 * @param e Event 参数
 */
function getPasteImgs(e) {
    var _a;
    var result = [];
    var txt = getPasteText(e);
    if (txt) {
        // 有文字，就忽略图片
        return result;
    }
    var items = (_a = e.clipboardData) === null || _a === void 0 ? void 0 : _a.items;
    if (!items)
        return result;
    util_1.forEach(items, function (key, value) {
        var type = value.type;
        if (/image/i.test(type)) {
            result.push(value.getAsFile());
        }
    });
    return result;
}
exports.getPasteImgs = getPasteImgs;
//# sourceMappingURL=paste-event.js.map