"use strict";
/**
 * @description 数据整理
 * @author fangzhicong
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.compliePosition = exports.complieNodes = exports.compileValue = exports.compileType = void 0;
var util_1 = require("../../../../utils/util");
/**
 * 数据类型
 */
function compileType(data) {
    switch (data) {
        case 'childList':
            return 'node';
        case 'attributes':
            return 'attr';
        default:
            return 'text';
    }
}
exports.compileType = compileType;
/**
 * 获取当前的文本内容
 */
function compileValue(data) {
    switch (data.type) {
        case 'attributes':
            return data.target.getAttribute(data.attributeName) || '';
        case 'characterData':
            return data.target.textContent;
        default:
            return '';
    }
}
exports.compileValue = compileValue;
/**
 * addedNodes/removedNodes
 */
function complieNodes(data) {
    var temp = {};
    if (data.addedNodes.length) {
        temp.add = util_1.toArray(data.addedNodes);
    }
    if (data.removedNodes.length) {
        temp.remove = util_1.toArray(data.removedNodes);
    }
    return temp;
}
exports.complieNodes = complieNodes;
/**
 * addedNodes/removedNodes 的相对位置
 */
function compliePosition(data) {
    var temp;
    if (data.previousSibling) {
        temp = {
            type: 'before',
            target: data.previousSibling,
        };
    }
    else if (data.nextSibling) {
        temp = {
            type: 'after',
            target: data.nextSibling,
        };
    }
    else {
        temp = {
            type: 'parent',
            target: data.target,
        };
    }
    return temp;
}
exports.compliePosition = compliePosition;
/**
 * 补全 Firefox 数据的特殊标签
 */
var tag = ['UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
/**
 * 将 MutationRecord 转换成自定义格式的数据
 */
function compile(data) {
    var temp = [];
    // 以下两个变量是兼容 Firefox 时使用到的
    // 前一次操作为删除元素节点
    var removeNode = false;
    // 连续的节点删除记录
    var removeCache = [];
    data.forEach(function (record, index) {
        var item = {
            type: compileType(record.type),
            target: record.target,
            attr: record.attributeName || '',
            value: compileValue(record) || '',
            oldValue: record.oldValue || '',
            nodes: complieNodes(record),
            position: compliePosition(record),
        };
        temp.push(item);
        // 兼容 Firefox，补全数据（这几十行代码写得吐血，跟 IE 有得一拼）
        if (!util_1.UA.isFirefox) {
            return;
        }
        // 正常的数据：缩进、行高、超链接、对齐方式、引用、插入表情、插入图片、分割线、表格、插入代码
        // 普通的数据补全：标题（纯文本内容）、加粗、斜体、删除线、下划线、颜色、背景色、字体、字号、列表（纯文本内容）
        // 特殊的数据补全：标题（包含 HTMLElement）、列表（包含 HTMLElement 或 ul -> ol 或 ol -> ul 或 Enter）
        if (removeNode && record.addedNodes.length && record.addedNodes[0].nodeType == 1) {
            // 需要被全数据的目标节点
            var replenishNode = record.addedNodes[0];
            var replenishData = {
                type: 'node',
                target: replenishNode,
                attr: '',
                value: '',
                oldValue: '',
                nodes: {
                    add: [removeNode],
                },
                position: {
                    type: 'parent',
                    target: replenishNode,
                },
            };
            // 特殊的标签：['UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
            if (tag.indexOf(replenishNode.nodeName) != -1) {
                replenishData.nodes.add = util_1.toArray(replenishNode.childNodes);
                temp.push(replenishData);
            }
            // 上一个删除元素是文本节点
            else if (removeNode.nodeType == 3) {
                if (contains(replenishNode, removeCache)) {
                    replenishData.nodes.add = util_1.toArray(replenishNode.childNodes);
                }
                temp.push(replenishData);
            }
            // 上一个删除元素是 Element && 由近到远的删除元素至少有一个是需要补全数据节点的子节点
            else if (tag.indexOf(record.target.nodeName) == -1 &&
                contains(replenishNode, removeCache)) {
                replenishData.nodes.add = util_1.toArray(replenishNode.childNodes);
                temp.push(replenishData);
            }
        }
        // 记录本次的节点信息
        if (item.type == 'node' && record.removedNodes.length == 1) {
            removeNode = record.removedNodes[0];
            removeCache.push(removeNode);
        }
        else {
            removeNode = false;
            removeCache.length = 0;
        }
    });
    return temp;
}
exports.default = compile;
// 删除元素的历史记录中包含有多少个目标节点的子元素
function contains(tar, childs) {
    var count = 0;
    for (var i = childs.length - 1; i > 0; i--) {
        if (tar.contains(childs[i])) {
            count++;
        }
        else {
            break;
        }
    }
    return count;
}
//# sourceMappingURL=compile.js.map