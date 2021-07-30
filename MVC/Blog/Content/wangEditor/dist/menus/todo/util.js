"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealTextNode = exports.isAllTodo = exports.isTodo = exports.getCursorNextNode = void 0;
/**
 * 判断传入的单行顶级选区选取是不是todo
 * @param editor 编辑器对象
 */
function isTodo($topSelectElem) {
    if ($topSelectElem.length) {
        return $topSelectElem.attr('class') === 'w-e-todo';
    }
    return false;
}
exports.isTodo = isTodo;
/**
 * 判断选中的内容是不是都是todo
 * @param editor 编辑器对象
 */
function isAllTodo(editor) {
    var $topSelectElems = editor.selection.getSelectionRangeTopNodes();
    // 排除为[]的情况
    if ($topSelectElems.length === 0)
        return;
    return $topSelectElems.every(function ($topSelectElem) {
        return isTodo($topSelectElem);
    });
}
exports.isAllTodo = isAllTodo;
/**
 * 根据所在的文本节点和光标在文本节点的位置获取截断的后节点内容
 * @param node 顶级节点
 * @param textNode 光标所在的文本节点
 * @param pos 光标在文本节点的位置
 */
function getCursorNextNode(node, textNode, pos) {
    if (!node.hasChildNodes())
        return;
    var newNode = node.cloneNode();
    // 判断光标是否在末尾
    var end = false;
    if (textNode.nodeValue === '') {
        end = true;
    }
    var delArr = [];
    node.childNodes.forEach(function (v) {
        //光标后的内容
        if (!isContains(v, textNode) && end) {
            newNode.appendChild(v.cloneNode(true));
            if (v.nodeName !== 'BR') {
                delArr.push(v);
            }
        }
        // 光标所在的区域
        if (isContains(v, textNode)) {
            if (v.nodeType === 1) {
                var childNode = getCursorNextNode(v, textNode, pos);
                if (childNode && childNode.textContent !== '')
                    newNode === null || newNode === void 0 ? void 0 : newNode.appendChild(childNode);
            }
            if (v.nodeType === 3) {
                if (textNode.isEqualNode(v)) {
                    var textContent = dealTextNode(v, pos);
                    newNode.textContent = textContent;
                }
            }
            end = true;
        }
    });
    // 删除选中后原来的节点
    delArr.forEach(function (v) {
        var node = v;
        node.remove();
    });
    return newNode;
}
exports.getCursorNextNode = getCursorNextNode;
/**
 * 判断otherNode是否包含在node中
 * @param node 父节点
 * @param otherNode 需要判断是不是被包含的节点
 */
function isContains(node, otherNode) {
    // 兼容ie11中textNode不支持contains方法
    if (node.nodeType === 3) {
        return node.nodeValue === otherNode.nodeValue;
    }
    return node.contains(otherNode);
}
/**
 * 获取新的文本节点
 * @param node 要处理的文本节点
 * @param pos  光标在文本节点所在的位置
 * @param start 设置为true时保留开始位置到光标的内容，设置为false时删去开始的内容
 */
function dealTextNode(node, pos, start) {
    if (start === void 0) { start = true; }
    var content = node.nodeValue;
    var oldContent = content === null || content === void 0 ? void 0 : content.slice(0, pos);
    content = content === null || content === void 0 ? void 0 : content.slice(pos);
    // start为false时替换content和oldContent
    if (!start) {
        var temp = content;
        content = oldContent;
        oldContent = temp;
    }
    node.nodeValue = oldContent;
    return content;
}
exports.dealTextNode = dealTextNode;
//# sourceMappingURL=util.js.map