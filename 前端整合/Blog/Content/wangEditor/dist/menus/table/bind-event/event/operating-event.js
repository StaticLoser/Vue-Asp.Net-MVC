"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../../utils/dom-core"));
/**
 * 处理新添加行
 * @param $node 整个table
 * @param _index 行的inde
 */
function ProcessingRow($node, _index) {
    //执行获取tbody节点
    var $dom = generateDomAction($node);
    //取出所有的行
    var domArray = Array.prototype.slice.apply($dom.children);
    //列的数量
    var childrenLength = domArray[0].children.length;
    //创建新tr
    var tr = document.createElement('tr');
    for (var i = 0; i < childrenLength; i++) {
        var td = document.createElement('td');
        tr.appendChild(td);
    }
    //插入集合中
    domArray.splice(_index + 1, 0, tr);
    //移除、新增节点事件
    removeAndInsertAction($dom, domArray);
    return dom_core_1.default($dom.parentNode);
}
/**
 * 处理新添加列
 * @param $node 整个table
 * @param _index 列的inde
 */
function ProcessingCol($node, _index) {
    //执行获取tbody节点
    var $dom = generateDomAction($node);
    //取出所有的行
    var domArray = Array.prototype.slice.apply($dom.children);
    var _loop_1 = function (i) {
        var cArray = [];
        //取出所有的列
        Array.from(domArray[i].children).forEach(function (item) {
            cArray.push(item);
        });
        //移除行的旧的子节点
        while (domArray[i].children.length !== 0) {
            domArray[i].removeChild(domArray[i].children[0]);
        }
        //列分th td
        var td = dom_core_1.default(cArray[0]).getNodeName() !== 'TH'
            ? document.createElement('td')
            : document.createElement('th');
        // let td = document.createElement('td')
        cArray.splice(_index + 1, 0, td);
        //插入新的子节点
        for (var j = 0; j < cArray.length; j++) {
            domArray[i].appendChild(cArray[j]);
        }
    };
    //创建td
    for (var i = 0; i < domArray.length; i++) {
        _loop_1(i);
    }
    //移除、新增节点事件
    removeAndInsertAction($dom, domArray);
    return dom_core_1.default($dom.parentNode);
}
/**
 * 处理删除行
 * @param $node  整个table
 * @param _index  行的inde
 */
function DeleteRow($node, _index) {
    //执行获取tbody节点
    var $dom = generateDomAction($node);
    //取出所有的行
    var domArray = Array.prototype.slice.apply($dom.children);
    //删除行
    domArray.splice(_index, 1);
    //移除、新增节点事件
    removeAndInsertAction($dom, domArray);
    return dom_core_1.default($dom.parentNode);
}
/**
 * 处理删除列
 * @param $node
 * @param _index
 */
function DeleteCol($node, _index) {
    //执行获取tbody节点
    var $dom = generateDomAction($node);
    //取出所有的行
    var domArray = Array.prototype.slice.apply($dom.children);
    var _loop_2 = function (i) {
        var cArray = [];
        //取出所有的列
        Array.from(domArray[i].children).forEach(function (item) {
            cArray.push(item);
        });
        //移除行的旧的子节点
        while (domArray[i].children.length !== 0) {
            domArray[i].removeChild(domArray[i].children[0]);
        }
        cArray.splice(_index, 1);
        //插入新的子节点
        for (var j = 0; j < cArray.length; j++) {
            domArray[i].appendChild(cArray[j]);
        }
    };
    //创建td
    for (var i = 0; i < domArray.length; i++) {
        _loop_2(i);
    }
    //移除、新增节点事件
    removeAndInsertAction($dom, domArray);
    return dom_core_1.default($dom.parentNode);
}
/**
 * 处理设置/取消表头
 * @param $node
 * @param _index
 * @type 替换的标签 th还是td
 */
function setTheHeader($node, _index, type) {
    // 执行获取tbody节点
    var $dom = generateDomAction($node);
    // 取出所有的行
    var domArray = Array.prototype.slice.apply($dom.children);
    // 列的数量
    var cols = domArray[_index].children;
    // 创建新tr
    var tr = document.createElement('tr');
    var _loop_3 = function (i) {
        // 根据type(td 或者 th)生成对应的el
        var el = document.createElement(type);
        var col = cols[i];
        /**
         * 没有使用children是因为谷歌纯文本内容children数组就为空，而火狐纯文本内容是“xxx<br>”使用children只能获取br
         * 当然使用childNodes也涵盖支持我们表头使用表情，代码块等，不管是设置还是取消都会保留第一行
         */
        Array.from(col.childNodes).forEach(function (item) {
            el.appendChild(item);
        });
        tr.appendChild(el);
    };
    for (var i = 0; i < cols.length; i++) {
        _loop_3(i);
    }
    //插入集合中
    domArray.splice(_index, 1, tr);
    //移除、新增节点事件
    removeAndInsertAction($dom, domArray);
    return dom_core_1.default($dom.parentNode);
}
/**
 * 封装移除、新增节点事件
 * @param $dom tbody节点
 * @param domArray  所有的行
 */
function removeAndInsertAction($dom, domArray) {
    //移除所有的旧的子节点
    while ($dom.children.length !== 0) {
        $dom.removeChild($dom.children[0]);
    }
    //插入新的子节点
    for (var i = 0; i < domArray.length; i++) {
        $dom.appendChild(domArray[i]);
    }
}
/**
 * 封装判断是否tbody节点
 * 粘贴的table 第一个节点是<colgroup> 最后的节点<tbody>
 * @param dom
 */
function generateDomAction($node) {
    var $dom = $node.elems[0].children[0];
    if ($dom.nodeName === 'COLGROUP') {
        $dom = $node.elems[0].children[$node.elems[0].children.length - 1];
    }
    return $dom;
}
exports.default = {
    ProcessingRow: ProcessingRow,
    ProcessingCol: ProcessingCol,
    DeleteRow: DeleteRow,
    DeleteCol: DeleteCol,
    setTheHeader: setTheHeader,
};
//# sourceMappingURL=operating-event.js.map