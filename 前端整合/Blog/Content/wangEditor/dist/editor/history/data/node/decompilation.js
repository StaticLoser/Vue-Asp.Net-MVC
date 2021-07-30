"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restore = exports.revoke = void 0;
/**
 * 将节点添加到 DOM 树中
 * @param data 数据项
 * @param list 节点集合（addedNodes 或 removedNodes）
 */
function insertNode(data, list) {
    var reference = data.position.target;
    switch (data.position.type) {
        // reference 在这些节点的前面
        case 'before':
            if (reference.nextSibling) {
                reference = reference.nextSibling;
                list.forEach(function (item) {
                    data.target.insertBefore(item, reference);
                });
            }
            else {
                list.forEach(function (item) {
                    data.target.appendChild(item);
                });
            }
            break;
        // reference 在这些节点的后面
        case 'after':
            list.forEach(function (item) {
                data.target.insertBefore(item, reference);
            });
            break;
        // parent
        // reference 是这些节点的父节点
        default:
            list.forEach(function (item) {
                reference.appendChild(item);
            });
            break;
    }
}
/* ------------------------------------------------------------------ 撤销逻辑 ------------------------------------------------------------------ */
function revokeNode(data) {
    for (var _i = 0, _a = Object.entries(data.nodes); _i < _a.length; _i++) {
        var _b = _a[_i], relative = _b[0], list = _b[1];
        switch (relative) {
            // 反向操作，将这些节点从 DOM 中移除
            case 'add':
                list.forEach(function (item) {
                    data.target.removeChild(item);
                });
                break;
            // remove（反向操作，将这些节点添加到 DOM 中）
            default: {
                insertNode(data, list);
                break;
            }
        }
    }
}
/**
 * 撤销 attribute
 */
function revokeAttr(data) {
    var target = data.target;
    if (data.oldValue == null) {
        target.removeAttribute(data.attr);
    }
    else {
        target.setAttribute(data.attr, data.oldValue);
    }
}
/**
 * 撤销文本内容
 */
function revokeText(data) {
    data.target.textContent = data.oldValue;
}
var revokeFns = {
    node: revokeNode,
    text: revokeText,
    attr: revokeAttr,
};
// 撤销 - 对外暴露的接口
function revoke(data) {
    for (var i = data.length - 1; i > -1; i--) {
        var item = data[i];
        revokeFns[item.type](item);
    }
}
exports.revoke = revoke;
/* ------------------------------------------------------------------ 恢复逻辑 ------------------------------------------------------------------ */
function restoreNode(data) {
    for (var _i = 0, _a = Object.entries(data.nodes); _i < _a.length; _i++) {
        var _b = _a[_i], relative = _b[0], list = _b[1];
        switch (relative) {
            case 'add': {
                insertNode(data, list);
                break;
            }
            // remove
            default: {
                list.forEach(function (item) {
                    ;
                    item.parentNode.removeChild(item);
                });
                break;
            }
        }
    }
}
function restoreText(data) {
    data.target.textContent = data.value;
}
function restoreAttr(data) {
    ;
    data.target.setAttribute(data.attr, data.value);
}
var restoreFns = {
    node: restoreNode,
    text: restoreText,
    attr: restoreAttr,
};
// 恢复 - 对外暴露的接口
function restore(data) {
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        restoreFns[item.type](item);
    }
}
exports.restore = restore;
//# sourceMappingURL=decompilation.js.map