"use strict";
/**
 * @description 封装 DOM 操作
 * @wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomElement = void 0;
var tslib_1 = require("tslib");
var util_1 = require("./util");
var AGENT_EVENTS = [];
/**
 * 根据 html 字符串创建 elem
 * @param {String} html html
 */
function _createElemByHTML(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    var elems = div.children;
    return util_1.toArray(elems);
}
/**
 * 判断是否是 DOM List
 * @param selector DOM 元素或列表
 */
function _isDOMList(selector) {
    if (!selector) {
        return false;
    }
    if (selector instanceof HTMLCollection || selector instanceof NodeList) {
        return true;
    }
    return false;
}
/**
 * 封装 querySelectorAll
 * @param selector css 选择器
 */
function _querySelectorAll(selector) {
    var elems = document.querySelectorAll(selector);
    return util_1.toArray(elems);
}
/**
 * 封装 _styleArrTrim
 * @param styleArr css
 */
function _styleArrTrim(style) {
    var styleArr = [];
    var resultArr = [];
    if (!Array.isArray(style)) {
        // 有 style，将 style 按照 `;` 拆分为数组
        styleArr = style.split(';');
    }
    else {
        styleArr = style;
    }
    styleArr.forEach(function (item) {
        // 对每项样式，按照 : 拆分为 key 和 value
        var arr = item.split(':').map(function (i) {
            return i.trim();
        });
        if (arr.length === 2) {
            resultArr.push(arr[0] + ':' + arr[1]);
        }
    });
    return resultArr;
}
// 构造函数
var DomElement = /** @class */ (function () {
    /**
     * 构造函数
     * @param selector 任一类型的选择器
     */
    function DomElement(selector) {
        // 初始化属性
        this.elems = [];
        this.length = this.elems.length;
        this.dataSource = new Map();
        if (!selector) {
            return;
        }
        // 原本就是 DomElement 实例，则直接返回
        if (selector instanceof DomElement) {
            return selector;
        }
        var selectorResult = []; // 存储查询结果
        var nodeType = selector instanceof Node ? selector.nodeType : -1;
        this.selector = selector;
        if (nodeType === 1 || nodeType === 9) {
            selectorResult = [selector];
        }
        else if (_isDOMList(selector)) {
            // DOM List
            selectorResult = util_1.toArray(selector);
        }
        else if (selector instanceof Array) {
            // Element 数组（其他数据类型，暂时忽略）
            selectorResult = selector;
        }
        else if (typeof selector === 'string') {
            // 字符串
            var tmpSelector = selector.replace('/\n/mg', '').trim();
            if (tmpSelector.indexOf('<') === 0) {
                // 如 <div>
                selectorResult = _createElemByHTML(tmpSelector);
            }
            else {
                // 如 #id .class
                selectorResult = _querySelectorAll(tmpSelector);
            }
        }
        var length = selectorResult.length;
        if (!length) {
            // 空数组
            return this;
        }
        // 加入 DOM 节点
        var i = 0;
        for (; i < length; i++) {
            this.elems.push(selectorResult[i]);
        }
        this.length = length;
    }
    Object.defineProperty(DomElement.prototype, "id", {
        /**
         * 获取元素 id
         */
        get: function () {
            return this.elems[0].id;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 遍历所有元素，执行回调函数
     * @param fn 回调函数
     */
    DomElement.prototype.forEach = function (fn) {
        for (var i = 0; i < this.length; i++) {
            var elem = this.elems[i];
            var result = fn.call(elem, elem, i);
            if (result === false) {
                break;
            }
        }
        return this;
    };
    /**
     * 克隆元素
     * @param deep 是否深度克隆
     */
    DomElement.prototype.clone = function (deep) {
        if (deep === void 0) { deep = false; }
        var cloneList = [];
        this.elems.forEach(function (elem) {
            cloneList.push(elem.cloneNode(!!deep));
        });
        return $(cloneList);
    };
    /**
     * 获取第几个元素
     * @param index index
     */
    DomElement.prototype.get = function (index) {
        if (index === void 0) { index = 0; }
        var length = this.length;
        if (index >= length) {
            index = index % length;
        }
        return $(this.elems[index]);
    };
    /**
     * 获取第一个元素
     */
    DomElement.prototype.first = function () {
        return this.get(0);
    };
    /**
     * 获取最后一个元素
     */
    DomElement.prototype.last = function () {
        var length = this.length;
        return this.get(length - 1);
    };
    DomElement.prototype.on = function (type, selector, fn) {
        if (!type)
            return this;
        // 没有 selector ，只有 type 和 fn
        if (typeof selector === 'function') {
            fn = selector;
            selector = '';
        }
        return this.forEach(function (elem) {
            // 没有事件代理
            if (!selector) {
                // 无代理
                elem.addEventListener(type, fn);
                return;
            }
            // 有事件代理
            var agentFn = function (e) {
                var target = e.target;
                if (target.matches(selector)) {
                    ;
                    fn.call(target, e);
                }
            };
            elem.addEventListener(type, agentFn);
            // 缓存代理事件
            AGENT_EVENTS.push({
                elem: elem,
                selector: selector,
                fn: fn,
                agentFn: agentFn,
            });
        });
    };
    DomElement.prototype.off = function (type, selector, fn) {
        if (!type)
            return this;
        // 没有 selector ，只有 type 和 fn
        if (typeof selector === 'function') {
            fn = selector;
            selector = '';
        }
        return this.forEach(function (elem) {
            // 解绑事件代理
            if (selector) {
                var idx = -1;
                for (var i = 0; i < AGENT_EVENTS.length; i++) {
                    var item = AGENT_EVENTS[i];
                    if (item.selector === selector && item.fn === fn && item.elem === elem) {
                        idx = i;
                        break;
                    }
                }
                if (idx !== -1) {
                    var agentFn = AGENT_EVENTS.splice(idx, 1)[0].agentFn;
                    elem.removeEventListener(type, agentFn);
                }
            }
            else {
                // @ts-ignore
                elem.removeEventListener(type, fn);
            }
        });
    };
    DomElement.prototype.attr = function (key, val) {
        if (val == null) {
            // 获取数据
            return this.elems[0].getAttribute(key) || '';
        }
        // 否则，设置属性
        return this.forEach(function (elem) {
            elem.setAttribute(key, val);
        });
    };
    /**
     * 删除 属性
     * @param key key
     */
    DomElement.prototype.removeAttr = function (key) {
        this.forEach(function (elem) {
            elem.removeAttribute(key);
        });
    };
    /**
     * 添加 css class
     * @param className css class
     */
    DomElement.prototype.addClass = function (className) {
        if (!className) {
            return this;
        }
        return this.forEach(function (elem) {
            if (elem.className) {
                // 当前有 class
                var arr = elem.className.split(/\s/);
                arr = arr.filter(function (item) {
                    return !!item.trim();
                });
                // 添加 class
                if (arr.indexOf(className) < 0) {
                    arr.push(className);
                }
                // 修改 elem.class
                elem.className = arr.join(' ');
            }
            else {
                // 当前没有 class
                elem.className = className;
            }
        });
    };
    /**
     * 添加 css class
     * @param className css class
     */
    DomElement.prototype.removeClass = function (className) {
        if (!className) {
            return this;
        }
        return this.forEach(function (elem) {
            if (!elem.className) {
                // 当前无 class
                return;
            }
            var arr = elem.className.split(/\s/);
            arr = arr.filter(function (item) {
                item = item.trim();
                // 删除 class
                if (!item || item === className) {
                    return false;
                }
                return true;
            });
            // 修改 elem.class
            elem.className = arr.join(' ');
        });
    };
    /**
     * 是否有传入的 css class
     * @param className css class
     */
    DomElement.prototype.hasClass = function (className) {
        if (!className) {
            return false;
        }
        var elem = this.elems[0];
        if (!elem.className) {
            // 当前无 class
            return false;
        }
        var arr = elem.className.split(/\s/);
        return arr.includes(className); // 是否包含
    };
    /**
     * 修改 css
     * @param key css key
     * @param val css value
     */
    // css(key: string): string
    DomElement.prototype.css = function (key, val) {
        var currentStyle;
        if (val == '') {
            currentStyle = '';
        }
        else {
            currentStyle = key + ":" + val + ";";
        }
        return this.forEach(function (elem) {
            var style = (elem.getAttribute('style') || '').trim();
            if (style) {
                // 有 style，将 style 按照 `;` 拆分为数组
                var resultArr = _styleArrTrim(style);
                // 替换现有的 style
                resultArr = resultArr.map(function (item) {
                    if (item.indexOf(key) === 0) {
                        return currentStyle;
                    }
                    else {
                        return item;
                    }
                });
                // 新增 style
                if (currentStyle != '' && resultArr.indexOf(currentStyle) < 0) {
                    resultArr.push(currentStyle);
                }
                // 去掉 空白
                if (currentStyle == '') {
                    resultArr = _styleArrTrim(resultArr);
                }
                // 重新设置 style
                elem.setAttribute('style', resultArr.join('; '));
            }
            else {
                // 当前没有 style
                elem.setAttribute('style', currentStyle);
            }
        });
    };
    /**
     * 封装 getBoundingClientRect
     */
    DomElement.prototype.getBoundingClientRect = function () {
        var elem = this.elems[0];
        return elem.getBoundingClientRect();
    };
    /**
     * 显示
     */
    DomElement.prototype.show = function () {
        return this.css('display', 'block');
    };
    /**
     * 隐藏
     */
    DomElement.prototype.hide = function () {
        return this.css('display', 'none');
    };
    /**
     * 获取子节点（只有 DOM 元素）
     */
    DomElement.prototype.children = function () {
        var elem = this.elems[0];
        if (!elem) {
            return null;
        }
        return $(elem.children);
    };
    /**
     * 获取子节点（包括文本节点）
     */
    DomElement.prototype.childNodes = function () {
        var elem = this.elems[0];
        if (!elem) {
            return null;
        }
        return $(elem.childNodes);
    };
    /**
     * 将子元素全部替换
     * @param $children 新的child节点
     */
    DomElement.prototype.replaceChildAll = function ($children) {
        var parent = this.getNode();
        var elem = this.elems[0];
        while (elem.hasChildNodes()) {
            parent.firstChild && elem.removeChild(parent.firstChild);
        }
        this.append($children);
    };
    /**
     * 增加子节点
     * @param $children 子节点
     */
    DomElement.prototype.append = function ($children) {
        return this.forEach(function (elem) {
            $children.forEach(function (child) {
                elem.appendChild(child);
            });
        });
    };
    /**
     * 移除当前节点
     */
    DomElement.prototype.remove = function () {
        return this.forEach(function (elem) {
            if (elem.remove) {
                elem.remove();
            }
            else {
                var parent_1 = elem.parentElement;
                parent_1 && parent_1.removeChild(elem);
            }
        });
    };
    /**
     * 当前元素，是否包含某个子元素
     * @param $child 子元素
     */
    DomElement.prototype.isContain = function ($child) {
        var elem = this.elems[0];
        var child = $child.elems[0];
        return elem.contains(child);
    };
    /**
     * 获取当前元素 nodeName
     */
    DomElement.prototype.getNodeName = function () {
        var elem = this.elems[0];
        return elem.nodeName;
    };
    /**
     * 根据元素位置获取元素节点（默认获取0位置的节点）
     * @param n 元素节点位置
     */
    DomElement.prototype.getNode = function (n) {
        if (n === void 0) { n = 0; }
        var elem;
        elem = this.elems[n];
        return elem;
    };
    /**
     * 查询
     * @param selector css 选择器
     */
    DomElement.prototype.find = function (selector) {
        var elem = this.elems[0];
        return $(elem.querySelectorAll(selector));
    };
    DomElement.prototype.text = function (val) {
        if (!val) {
            // 获取 text
            var elem = this.elems[0];
            return elem.innerHTML.replace(/<[^>]+>/g, function () { return ''; });
        }
        else {
            // 设置 text
            return this.forEach(function (elem) {
                elem.innerHTML = val;
            });
        }
    };
    DomElement.prototype.html = function (val) {
        var elem = this.elems[0];
        if (!val) {
            // 获取 html
            return elem.innerHTML;
        }
        else {
            // 设置 html
            elem.innerHTML = val;
            return this;
        }
    };
    /**
     * 获取元素 value
     */
    DomElement.prototype.val = function () {
        var elem = this.elems[0];
        return elem.value.trim(); // 暂用 any
    };
    /**
     * focus 到当前元素
     */
    DomElement.prototype.focus = function () {
        return this.forEach(function (elem) {
            elem.focus();
        });
    };
    /**
     * 当前元素前一个兄弟节点
     */
    DomElement.prototype.prev = function () {
        var elem = this.elems[0];
        return $(elem.previousElementSibling);
    };
    /**
     * 当前元素后一个兄弟节点
     * 不包括文本节点、注释节点）
     */
    DomElement.prototype.next = function () {
        var elem = this.elems[0];
        return $(elem.nextElementSibling);
    };
    /**
     * 获取当前节点的下一个兄弟节点
     * 包括文本节点、注释节点即回车、换行、空格、文本等等）
     */
    DomElement.prototype.getNextSibling = function () {
        var elem = this.elems[0];
        return $(elem.nextSibling);
    };
    /**
     * 获取父元素
     */
    DomElement.prototype.parent = function () {
        var elem = this.elems[0];
        return $(elem.parentElement);
    };
    /**
     * 查找父元素，直到满足 selector 条件
     * @param selector css 选择器
     * @param curElem 从哪个元素开始查找，默认为当前元素
     */
    DomElement.prototype.parentUntil = function (selector, curElem) {
        var elem = curElem || this.elems[0];
        if (elem.nodeName === 'BODY') {
            return null;
        }
        var parent = elem.parentElement;
        if (parent === null) {
            return null;
        }
        if (parent.matches(selector)) {
            // 找到，并返回
            return $(parent);
        }
        // 继续查找，递归
        return this.parentUntil(selector, parent);
    };
    /**
     * 查找父元素，直到满足 selector 条件,或者 到达 编辑区域容器以及菜单栏容器
     * @param selector css 选择器
     * @param curElem 从哪个元素开始查找，默认为当前元素
     */
    DomElement.prototype.parentUntilEditor = function (selector, editor, curElem) {
        var elem = curElem || this.elems[0];
        if ($(elem).equal(editor.$textContainerElem) || $(elem).equal(editor.$toolbarElem)) {
            return null;
        }
        var parent = elem.parentElement;
        if (parent === null) {
            return null;
        }
        if (parent.matches(selector)) {
            // 找到，并返回
            return $(parent);
        }
        // 继续查找，递归
        return this.parentUntilEditor(selector, editor, parent);
    };
    /**
     * 判读是否相等
     * @param $elem 元素
     */
    DomElement.prototype.equal = function ($elem) {
        if ($elem instanceof DomElement) {
            return this.elems[0] === $elem.elems[0];
        }
        else if ($elem instanceof HTMLElement) {
            return this.elems[0] === $elem;
        }
        else {
            return false;
        }
    };
    /**
     * 将该元素插入到某个元素前面
     * @param selector css 选择器
     */
    DomElement.prototype.insertBefore = function (selector) {
        var $referenceNode = $(selector);
        var referenceNode = $referenceNode.elems[0];
        if (!referenceNode) {
            return this;
        }
        return this.forEach(function (elem) {
            var parent = referenceNode.parentNode;
            parent.insertBefore(elem, referenceNode);
        });
    };
    /**
     * 将该元素插入到selector元素后面
     * @param selector css 选择器
     */
    DomElement.prototype.insertAfter = function (selector) {
        var $referenceNode = $(selector);
        var referenceNode = $referenceNode.elems[0];
        var anchorNode = referenceNode && referenceNode.nextSibling;
        if (!referenceNode) {
            return this;
        }
        return this.forEach(function (elem) {
            var parent = referenceNode.parentNode;
            if (anchorNode) {
                parent.insertBefore(elem, anchorNode);
            }
            else {
                parent.appendChild(elem);
            }
        });
    };
    /**
     * 设置/获取 数据
     * @param key key
     * @param value value
     */
    DomElement.prototype.data = function (key, value) {
        if (value != null) {
            // 设置数据
            this.dataSource.set(key, value);
        }
        else {
            // 获取数据
            return this.dataSource.get(key);
        }
    };
    /**
     * 获取当前节点的顶级(段落)
     * @param editor 富文本实例
     */
    DomElement.prototype.getNodeTop = function (editor) {
        // 异常抛出，空的 DomElement 直接返回
        if (this.length < 1) {
            return this;
        }
        // 获取父级元素，并判断是否是 编辑区域
        // 如果是则返回当前节点
        var $parent = this.parent();
        // fix：添加当前元素与编辑区元素的比较，防止传入的当前元素就是编辑区元素而造成的获取顶级元素为空的情况
        if (editor.$textElem.equal(this) || editor.$textElem.equal($parent)) {
            return this;
        }
        // 到了此处，即代表当前节点不是顶级段落
        // 将当前节点存放于父节点的 prior 字段下
        // 主要用于 回溯 子节点
        // 例如：ul ol 等标签
        // 实际操作的节点是 li 但是一个 ul ol 的子节点可能有多个
        // 所以需要对其进行 回溯 找到对应的子节点
        $parent.prior = this;
        return $parent.getNodeTop(editor);
    };
    /**
     * 获取当前 节点 基与上一个拥有相对或者解决定位的父容器的位置
     * @param editor 富文本实例
     */
    DomElement.prototype.getOffsetData = function () {
        var $node = this.elems[0];
        return {
            top: $node.offsetTop,
            left: $node.offsetLeft,
            width: $node.offsetWidth,
            height: $node.offsetHeight,
            parent: $node.offsetParent,
        };
    };
    /**
     * 从上至下进行滚动
     * @param top 滚动的值
     */
    DomElement.prototype.scrollTop = function (top) {
        var $node = this.elems[0];
        $node.scrollTo({ top: top });
    };
    return DomElement;
}());
exports.DomElement = DomElement;
// new 一个对象
function $() {
    var arg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arg[_i] = arguments[_i];
    }
    return new (DomElement.bind.apply(DomElement, tslib_1.__spreadArrays([void 0], arg)))();
}
exports.default = $;
//# sourceMappingURL=dom-core.js.map