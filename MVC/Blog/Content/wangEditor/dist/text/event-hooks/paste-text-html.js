"use strict";
/**
 * @description 粘贴 text html
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var paste_event_1 = require("../paste/paste-event");
var util_1 = require("../../utils/util");
var const_1 = require("../../utils/const");
/**
 * 格式化html
 * @param val 粘贴的html
 * @author liuwei
 */
function formatHtml(val) {
    var pasteText = val;
    // div 全部替换为 p 标签
    pasteText = pasteText.replace(/<div>/gim, '<p>').replace(/<\/div>/gim, '</p>');
    // 不允许空行，放在最后
    pasteText = pasteText.replace(/<p><\/p>/gim, '<p><br></p>');
    // 去除''
    return pasteText.trim();
}
/**
 * 格式化html
 * @param val 粘贴的html
 * @author liuwei
 */
function formatCode(val) {
    var pasteText = val.replace(/<br>|<br\/>/gm, '\n').replace(/<[^>]+>/gm, '');
    return pasteText;
}
/**
 * 判断html是否使用P标签包裹
 * @param html 粘贴的html
 * @author luochao
 */
function isParagraphHtml(html) {
    var _a;
    if (html === '')
        return false;
    var container = document.createElement('div');
    container.innerHTML = html;
    return ((_a = container.firstChild) === null || _a === void 0 ? void 0 : _a.nodeName) === 'P';
}
/**
 * 判断当前选区是否是空段落
 * @param topElem 选区顶层元素
 * @author luochao
 */
function isEmptyParagraph(topElem) {
    if (!(topElem === null || topElem === void 0 ? void 0 : topElem.length))
        return false;
    var dom = topElem.elems[0];
    return dom.nodeName === 'P' && dom.innerHTML === '<br>';
}
/**
 * 粘贴文本和 html
 * @param editor 编辑器对象
 * @param pasteEvents 粘贴事件列表
 */
function pasteTextHtml(editor, pasteEvents) {
    function fn(e) {
        // 获取配置
        var config = editor.config;
        var pasteFilterStyle = config.pasteFilterStyle;
        var pasteIgnoreImg = config.pasteIgnoreImg;
        var pasteTextHandle = config.pasteTextHandle;
        // 获取粘贴的文字
        var pasteHtml = paste_event_1.getPasteHtml(e, pasteFilterStyle, pasteIgnoreImg);
        var pasteText = paste_event_1.getPasteText(e);
        pasteText = pasteText.replace(/\n/gm, '<br>');
        // 当前选区所在的 DOM 节点
        var $selectionElem = editor.selection.getSelectionContainerElem();
        if (!$selectionElem) {
            return;
        }
        var nodeName = $selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.getNodeName();
        var $topElem = $selectionElem === null || $selectionElem === void 0 ? void 0 : $selectionElem.getNodeTop(editor);
        // 当前节点顶级可能没有
        var topNodeName = '';
        if ($topElem.elems[0]) {
            topNodeName = $topElem === null || $topElem === void 0 ? void 0 : $topElem.getNodeName();
        }
        // code 中只能粘贴纯文本
        if (nodeName === 'CODE' || topNodeName === 'PRE') {
            if (pasteTextHandle && util_1.isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteText = '' + (pasteTextHandle(pasteText) || '');
            }
            editor.cmd.do('insertHTML', formatCode(pasteText));
            return;
        }
        // 如果用户开启闭粘贴样式注释则将复制进来为url的直接转为链接 否则不转换
        //  在群中有用户提到关闭样式粘贴复制的文字进来后链接直接转为文字了，不符合预期，这里优化下
        if (const_1.urlRegex.test(pasteText) && pasteFilterStyle) {
            //当复制的内容为链接时，也应该判断用户是否定义了处理粘贴的事件
            if (pasteTextHandle && util_1.isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteText = '' + (pasteTextHandle(pasteText) || ''); // html
            }
            var insertUrl = const_1.urlRegex.exec(pasteText)[0];
            var otherText = pasteText.replace(const_1.urlRegex, '');
            return editor.cmd.do('insertHTML', "<a href=\"" + insertUrl + "\" target=\"_blank\">" + insertUrl + "</a>" + otherText); // html
        }
        // table 中（td、th），待开发。。。
        if (!pasteHtml) {
            return;
        }
        try {
            // firefox 中，获取的 pasteHtml 可能是没有 <ul> 包裹的 <li>
            // 因此执行 insertHTML 会报错
            if (pasteTextHandle && util_1.isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteHtml = '' + (pasteTextHandle(pasteHtml) || ''); // html
            }
            // 粘贴的html的是否是css的style样式
            var isCssStyle = /[\.\#\@]?\w+[ ]+\{[^}]*\}/.test(pasteHtml); // eslint-disable-line
            // 经过处理后还是包含暴露的css样式则直接插入它的text
            if (isCssStyle && pasteFilterStyle) {
                editor.cmd.do('insertHTML', "" + formatHtml(pasteText)); // text
            }
            else {
                var html = formatHtml(pasteHtml);
                // 如果是段落，为了兼容 firefox 和 chrome差异，自定义插入
                if (isParagraphHtml(html)) {
                    var $textEl = editor.$textElem;
                    editor.cmd.do('insertHTML', html);
                    // 全选的情况下覆盖原有内容
                    if ($textEl.equal($selectionElem)) {
                        // 更新选区
                        editor.selection.createEmptyRange();
                        return;
                    }
                    // 如果选区是空段落，移除空段落
                    if (isEmptyParagraph($topElem)) {
                        $topElem.remove();
                    }
                    // 当复制粘贴的内容是 段落 的时候
                    // 这里会将光标移动到编辑区域的末端
                    // 如果是作为重置光标来使用的，应该是将光标移动到插入的 html 的末端才对
                    // 注释后并没有发现光标的位置不正常
                    // 移动光标到编辑器最后的位置
                    // const lastEl = $textEl.last()
                    // if (!lastEl?.length) return
                    // editor.selection.moveCursor(lastEl.elems[0])
                }
                else {
                    // 如果用户从百度等网站点击复制得到的图片是一串img标签且待src的http地址
                    // 见 https://github.com/wangeditor-team/wangEditor/issues/3119
                    // 如果是走用户定义的图片上传逻辑
                    var isHasOnlyImgEleReg = /^<img [^>]*src=['"]([^'"]+)[^>]*>$/g;
                    if (!isHasOnlyImgEleReg.test(html)) {
                        editor.cmd.do('insertHTML', html);
                    }
                }
            }
        }
        catch (ex) {
            // 此时使用 pasteText 来兼容一下
            if (pasteTextHandle && util_1.isFunction(pasteTextHandle)) {
                // 用户自定义过滤处理粘贴内容
                pasteText = '' + (pasteTextHandle(pasteText) || '');
            }
            editor.cmd.do('insertHTML', "" + formatHtml(pasteText)); // text
        }
    }
    pasteEvents.push(fn);
}
exports.default = pasteTextHtml;
//# sourceMappingURL=paste-text-html.js.map