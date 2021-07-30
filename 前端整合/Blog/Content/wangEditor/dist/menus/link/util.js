"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertHtml = exports.createPartHtml = exports.makeHtmlString = exports.getTopNode = void 0;
/**
 * 获取除了包裹在整行区域的顶级Node
 * @param node 最外层node下的某个childNode
 * @param topText 最外层node中文本内容
 */
function getTopNode(node, topText) {
    var pointerNode = node;
    var topNode = node;
    do {
        if (pointerNode.textContent === topText)
            break;
        topNode = pointerNode;
        if (pointerNode.parentNode) {
            pointerNode = pointerNode === null || pointerNode === void 0 ? void 0 : pointerNode.parentNode;
        }
    } while ((pointerNode === null || pointerNode === void 0 ? void 0 : pointerNode.nodeName) !== 'P');
    return topNode;
}
exports.getTopNode = getTopNode;
/**
 * 生成html的string形式
 * @param tagName 标签名
 * @param content 需要包裹的内容
 */
function makeHtmlString(node, content) {
    var tagName = node.nodeName;
    var attr = '';
    if (node.nodeType === 3) {
        return content;
    }
    if (node.nodeType === 1) {
        var style = node.getAttribute('style');
        var face = node.getAttribute('face');
        var color = node.getAttribute('color');
        if (style)
            attr = attr + (" style=\"" + style + "\"");
        if (face)
            attr = attr + (" face=\"" + face + "\"");
        if (color)
            attr = attr + (" color=\"" + color + "\"");
    }
    tagName = tagName.toLowerCase();
    return "<" + tagName + attr + ">" + content + "</" + tagName + ">";
}
exports.makeHtmlString = makeHtmlString;
/**
 * 生成开始或者结束位置的html字符片段
 * @param topText 选区所在的行的文本内容
 * @param node 选区给出的node节点
 * @param startPos node文本内容选取的开始位置
 * @param endPos node文本内容选取的结束位置
 */
function createPartHtml(topText, node, startPos, endPost) {
    var _a;
    var selectionContent = (_a = node.textContent) === null || _a === void 0 ? void 0 : _a.substring(startPos, endPost);
    var pointerNode = node;
    var content = '';
    do {
        content = makeHtmlString(pointerNode, selectionContent !== null && selectionContent !== void 0 ? selectionContent : '');
        selectionContent = content;
        pointerNode = pointerNode === null || pointerNode === void 0 ? void 0 : pointerNode.parentElement;
    } while (pointerNode && pointerNode.textContent !== topText);
    return content;
}
exports.createPartHtml = createPartHtml;
/**
 * 生成需要插入的html内容的字符串形式
 * @param selection 选区对象
 * @param topNode 选区所在行的顶级node节点
 */
function insertHtml(selection, topNode) {
    var _a, _b, _c, _d, _e;
    var anchorNode = selection.anchorNode, focusNode = selection.focusNode, anchorPos = selection.anchorOffset, focusPos = selection.focusOffset;
    var topText = (_a = topNode.textContent) !== null && _a !== void 0 ? _a : '';
    var TagArr = getContainerTag(topNode);
    var content = '';
    var startContent = '';
    var middleContent = '';
    var endContent = '';
    var startNode = anchorNode;
    var endNode = focusNode;
    // 用来保存 anchorNode的非p最外层节点
    var pointerNode = anchorNode;
    // 节点是同一个的处理
    if (anchorNode === null || anchorNode === void 0 ? void 0 : anchorNode.isEqualNode(focusNode !== null && focusNode !== void 0 ? focusNode : null)) {
        var innerContent = createPartHtml(topText, anchorNode, anchorPos, focusPos);
        innerContent = addContainer(TagArr, innerContent);
        return innerContent;
    }
    // 选中开始位置节点的处理
    if (anchorNode)
        startContent = createPartHtml(topText, anchorNode, anchorPos !== null && anchorPos !== void 0 ? anchorPos : 0);
    // 结束位置节点的处理
    if (focusNode)
        endContent = createPartHtml(topText, focusNode, 0, focusPos);
    // 将指针节点位置放置到开始的节点
    if (anchorNode) {
        // 获取start的非p顶级node
        startNode = getTopNode(anchorNode, topText);
    }
    if (focusNode) {
        // 获取end的非p顶级node
        endNode = getTopNode(focusNode, topText);
    }
    // 处于开始和结束节点位置之间的节点的处理
    pointerNode = (_b = startNode === null || startNode === void 0 ? void 0 : startNode.nextSibling) !== null && _b !== void 0 ? _b : anchorNode;
    while (!(pointerNode === null || pointerNode === void 0 ? void 0 : pointerNode.isEqualNode(endNode !== null && endNode !== void 0 ? endNode : null))) {
        var pointerNodeName = pointerNode === null || pointerNode === void 0 ? void 0 : pointerNode.nodeName;
        if (pointerNodeName === '#text') {
            middleContent = middleContent + (pointerNode === null || pointerNode === void 0 ? void 0 : pointerNode.textContent);
        }
        else {
            var htmlString = (_d = (_c = pointerNode === null || pointerNode === void 0 ? void 0 : pointerNode.firstChild) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.innerHTML;
            if (pointerNode)
                middleContent = middleContent + makeHtmlString(pointerNode, htmlString !== null && htmlString !== void 0 ? htmlString : '');
        }
        pointerNode = (_e = pointerNode === null || pointerNode === void 0 ? void 0 : pointerNode.nextSibling) !== null && _e !== void 0 ? _e : pointerNode;
    }
    content = "" + startContent + middleContent + endContent;
    // 增加最外层包裹标签
    content = addContainer(TagArr, content);
    return content;
}
exports.insertHtml = insertHtml;
/**
 * 获取包裹在最外层的非p Node tagName 数组
 * @param node 选区所在行的node节点
 */
function getContainerTag(node) {
    var _a;
    var topText = (_a = node.textContent) !== null && _a !== void 0 ? _a : '';
    var tagArr = [];
    while ((node === null || node === void 0 ? void 0 : node.textContent) === topText) {
        if (node.nodeName !== 'P') {
            tagArr.push(node);
        }
        node = node.childNodes[0];
    }
    return tagArr;
}
/**
 * 为内容增加包裹标签
 * @param tagArr 最外层包裹的tag数组，索引越小tag越在外面
 * @param content tag要包裹的内容
 */
function addContainer(tagArr, content) {
    tagArr.forEach(function (v) {
        content = makeHtmlString(v, content);
    });
    return content;
}
//# sourceMappingURL=util.js.map