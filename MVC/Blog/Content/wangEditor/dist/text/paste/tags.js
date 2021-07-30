"use strict";
/**
 * @description 粘贴相关的 tags
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOP_LEVEL_TAGS = exports.EMPTY_TAGS = exports.NECESSARY_ATTRS = exports.IGNORE_TAGS = void 0;
// 忽略的标签
exports.IGNORE_TAGS = new Set([
    'doctype',
    '!doctype',
    'html',
    'head',
    'meta',
    'body',
    'script',
    'style',
    'link',
    'frame',
    'iframe',
    'title',
    'svg',
    'center',
    'o:p',
]);
// 指定标签必要的属性
exports.NECESSARY_ATTRS = new Map([
    ['img', ['src', 'alt']],
    ['a', ['href', 'target']],
    ['td', ['colspan', 'rowspan']],
    ['th', ['colspan', 'rowspan']],
]);
// 没有子节点或文本的标签
exports.EMPTY_TAGS = new Set([
    'area',
    'base',
    'basefont',
    'br',
    'col',
    'hr',
    'img',
    'input',
    'isindex',
    'embed',
]);
// 编辑区域顶级节点
exports.TOP_LEVEL_TAGS = new Set([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'p',
    'ul',
    'ol',
    'table',
    'blockquote',
    'pre',
    'hr',
    'form',
]);
//# sourceMappingURL=tags.js.map