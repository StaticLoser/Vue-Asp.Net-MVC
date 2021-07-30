"use strict";
/**
 * @description 将粘贴的 html 字符串，转换为正确、简洁的 html 代码。剔除不必要的标签和属性。
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tags_1 = require("./tags");
var simplehtmlparser_js_1 = tslib_1.__importDefault(require("../../lib/simplehtmlparser.js"));
/**
 * 过滤掉空 span
 * @param html html
 */
function filterEmptySpan(html) {
    var regForReplace = /<span>.*?<\/span>/gi;
    var regForMatch = /<span>(.*?)<\/span>/;
    return html.replace(regForReplace, function (s) {
        // s 是单个 span ，如 <span>文字</span>
        var result = s.match(regForMatch);
        if (result == null)
            return '';
        return result[1];
    });
}
/**
 * 是否忽略标签
 * @param tag tag
 * @param ignoreImg 是否忽略 img 标签
 */
function isIgnoreTag(tag, ignoreImg) {
    tag = tag.toLowerCase().trim();
    // 忽略的标签
    if (tags_1.IGNORE_TAGS.has(tag)) {
        return true;
    }
    // 是否忽略图片
    if (ignoreImg) {
        if (tag === 'img') {
            return true;
        }
    }
    return false;
}
/**
 * 为 tag 生成 html 字符串，开始部分
 * @param tag tag
 * @param attrs 属性
 */
function genStartHtml(tag, attrs) {
    var result = '';
    // tag < 符号
    result = "<" + tag;
    // 拼接属性
    var attrStrArr = [];
    attrs.forEach(function (attr) {
        attrStrArr.push(attr.name + "=\"" + attr.value + "\"");
    });
    if (attrStrArr.length > 0) {
        result = result + ' ' + attrStrArr.join(' ');
    }
    // tag > 符号
    var isEmpty = tags_1.EMPTY_TAGS.has(tag); // 没有子节点或文本的标签，如 img
    result = result + (isEmpty ? '/' : '') + '>';
    return result;
}
/**
 * 为 tag 生成 html 字符串，结尾部分
 * @param tag tag
 */
function genEndHtml(tag) {
    return "</" + tag + ">";
}
/**
 * 处理粘贴的 html
 * @param html html 字符串
 * @param filterStyle 是否过滤 style 样式
 * @param ignoreImg 是否忽略 img 标签
 */
function parseHtml(html, filterStyle, ignoreImg) {
    if (filterStyle === void 0) { filterStyle = true; }
    if (ignoreImg === void 0) { ignoreImg = false; }
    var resultArr = []; // 存储结果，数组形式，最后再 join
    // 当前正在处理的标签，以及记录和清除的方法
    var CUR_TAG = '';
    function markTagStart(tag) {
        tag = tag.trim();
        if (!tag)
            return;
        if (tags_1.EMPTY_TAGS.has(tag))
            return; // 内容为空的标签，如 img ，不用记录
        CUR_TAG = tag;
    }
    function markTagEnd() {
        CUR_TAG = '';
    }
    // 能通过 'text/html' 格式获取 html
    var htmlParser = new simplehtmlparser_js_1.default();
    htmlParser.parse(html, {
        startElement: function (tag, attrs) {
            // 首先，标记开始
            markTagStart(tag);
            // 忽略的标签
            if (isIgnoreTag(tag, ignoreImg)) {
                return;
            }
            // 找出该标签必须的属性（其他的属性忽略）
            var necessaryAttrKeys = tags_1.NECESSARY_ATTRS.get(tag) || [];
            var attrsForTag = [];
            attrs.forEach(function (attr) {
                // 属性名
                var name = attr.name;
                // style 单独处理
                if (name === 'style') {
                    // 保留 style 样式
                    if (!filterStyle) {
                        attrsForTag.push(attr);
                    }
                    return;
                }
                // 除了 style 之外的其他属性
                if (necessaryAttrKeys.includes(name) === false) {
                    // 不是必须的属性，忽略
                    return;
                }
                attrsForTag.push(attr);
            });
            // 拼接为 HTML 标签
            var html = genStartHtml(tag, attrsForTag);
            resultArr.push(html);
        },
        characters: function (str) {
            if (!str) {
                return;
            }
            // 忽略的标签
            if (isIgnoreTag(CUR_TAG, ignoreImg))
                return;
            resultArr.push(str);
        },
        endElement: function (tag) {
            // 忽略的标签
            if (isIgnoreTag(tag, ignoreImg)) {
                return;
            }
            // 拼接为 HTML 标签
            var html = genEndHtml(tag);
            resultArr.push(html);
            // 最后，标记结束
            markTagEnd();
        },
        comment: function (str) {
            /* 注释，不做处理 */
            markTagStart(str);
        },
    });
    var result = resultArr.join(''); // 转换为字符串
    // 过滤掉空 span 标签
    result = filterEmptySpan(result);
    return result;
}
exports.default = parseHtml;
//# sourceMappingURL=parse-html.js.map