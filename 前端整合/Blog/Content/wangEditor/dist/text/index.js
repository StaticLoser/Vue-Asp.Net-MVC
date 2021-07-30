"use strict";
/**
 * @description 编辑区域，入口文件
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../utils/dom-core"));
var index_1 = tslib_1.__importDefault(require("./event-hooks/index"));
var util_1 = require("../utils/util");
var getChildrenJSON_1 = tslib_1.__importDefault(require("./getChildrenJSON"));
var getHtmlByNodeList_1 = tslib_1.__importDefault(require("./getHtmlByNodeList"));
var const_1 = require("../utils/const");
var Text = /** @class */ (function () {
    function Text(editor) {
        this.editor = editor;
        this.eventHooks = {
            onBlurEvents: [],
            changeEvents: [],
            dropEvents: [],
            clickEvents: [],
            keydownEvents: [],
            keyupEvents: [],
            tabUpEvents: [],
            tabDownEvents: [],
            enterUpEvents: [],
            enterDownEvents: [],
            deleteUpEvents: [],
            deleteDownEvents: [],
            pasteEvents: [],
            linkClickEvents: [],
            codeClickEvents: [],
            textScrollEvents: [],
            toolbarClickEvents: [],
            imgClickEvents: [],
            imgDragBarMouseDownEvents: [],
            tableClickEvents: [],
            menuClickEvents: [],
            dropListMenuHoverEvents: [],
            splitLineEvents: [],
            videoClickEvents: [],
        };
    }
    /**
     * 初始化
     */
    Text.prototype.init = function () {
        // 实时保存选取范围
        this._saveRange();
        // 绑定事件
        this._bindEventHooks();
        // 初始化 text 事件钩子函数
        index_1.default(this);
    };
    /**
     * 切换placeholder
     */
    Text.prototype.togglePlaceholder = function () {
        var html = this.html();
        var $placeholder = this.editor.$textContainerElem.find('.placeholder');
        $placeholder.hide();
        if (this.editor.isComposing)
            return;
        if (!html || html === ' ')
            $placeholder.show();
    };
    /**
     * 清空内容
     */
    Text.prototype.clear = function () {
        this.html(const_1.EMPTY_P);
    };
    /**
     * 设置/获取 html
     * @param val html 字符串
     */
    Text.prototype.html = function (val) {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        // 没有 val ，则是获取 html
        if (val == null) {
            var html_1 = $textElem.html();
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            html_1 = html_1.replace(/\u200b/gm, '');
            // 去掉空行
            html_1 = html_1.replace(/<p><\/p>/gim, '');
            // 去掉最后的 空标签
            html_1 = html_1.replace(const_1.EMPTY_P_LAST_REGEX, '');
            // 为了避免用户在最后生成的EMPTY_P标签中编辑数据, 最后产生多余标签, 去除所有p标签上的data-we-empty-p属性
            html_1 = html_1.replace(const_1.EMPTY_P_REGEX, '<p>');
            /**
             * 这里的代码为了处理火狐多余的空行标签,但是强制删除空行标签会带来其他问题
             * html()方法返回的的值,EMPTY_P中pr会被删除,只留下<p>,点不进去,从而产生垃圾数据
             * 目前在末位有多个空行的情况下执行撤销重做操作,会产生一种不记录末尾空行的错觉
             * 暂时注释, 等待进一步的兼容处理
             */
            // html = html.replace(/><br>(?!<)/gi, '>') // 过滤 <p><br>内容</p> 中的br
            // html = html.replace(/(?!>)<br></gi, '<') // 过滤 <p>内容<br></p> 中的br
            /**
             * pre标签格式化
             * html()方法理论上应当输出纯净的代码文本,但是对于是否解析html标签还没有良好的判断
             * 如果去除hljs的标签,在解析状态下回显,会造成显示错误并且无法再通过hljs方法渲染
             * 暂且其弃用
             */
            // html = formatCodeHtml(editor, html)
            // 将没有自闭和的标签过滤为自闭和
            var selfCloseHtmls = html_1.match(/<(img|br|hr|input)[^>]*>/gi);
            if (selfCloseHtmls !== null) {
                selfCloseHtmls.forEach(function (item) {
                    if (!item.match(/\/>/)) {
                        html_1 = html_1.replace(item, item.substring(0, item.length - 1) + '/>');
                    }
                });
            }
            return html_1;
        }
        // 有 val ，则是设置 html
        val = val.trim();
        if (val === '') {
            val = const_1.EMPTY_P;
        }
        if (val.indexOf('<') !== 0) {
            // 内容用 p 标签包裹
            val = "<p>" + val + "</p>";
        }
        $textElem.html(val);
        // 初始化选区，将光标定位到内容尾部
        editor.initSelection();
    };
    /**
     * 将json设置成html至编辑器
     * @param nodeList json格式
     */
    Text.prototype.setJSON = function (nodeList) {
        var html = getHtmlByNodeList_1.default(nodeList).children();
        var editor = this.editor;
        var $textElem = editor.$textElem;
        // 没有获取到元素的情况
        if (!html)
            return;
        // 替换文本节点下全部子节点
        $textElem.replaceChildAll(html);
    };
    /**
     * 获取 json 格式的数据
     */
    Text.prototype.getJSON = function () {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        return getChildrenJSON_1.default($textElem);
    };
    Text.prototype.text = function (val) {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        // 没有 val ，是获取 text
        if (val == null) {
            var text = $textElem.text();
            // 未选中任何内容的时候点击“加粗”或者“斜体”等按钮，就得需要一个空的占位符 &#8203 ，这里替换掉
            text = text.replace(/\u200b/gm, '');
            return text;
        }
        // 有 val ，则是设置 text
        $textElem.text("<p>" + val + "</p>");
        // 初始化选区，将光标定位到内容尾部
        editor.initSelection();
    };
    /**
     * 追加 html 内容
     * @param html html 字符串
     */
    Text.prototype.append = function (html) {
        var editor = this.editor;
        if (html.indexOf('<') !== 0) {
            // 普通字符串，用 <p> 包裹
            html = "<p>" + html + "</p>";
        }
        this.html(this.html() + html);
        // 初始化选区，将光标定位到内容尾部
        editor.initSelection();
    };
    /**
     * 每一步操作，都实时保存选区范围
     */
    Text.prototype._saveRange = function () {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        var $document = dom_core_1.default(document);
        // 保存当前的选区
        function saveRange() {
            // 随时保存选区
            editor.selection.saveRange();
            // 更新按钮 active 状态
            editor.menus.changeActive();
        }
        // 按键后保存
        $textElem.on('keyup', saveRange);
        // 点击后保存，为了避免被多次执行而导致造成浪费，这里对 click 使用一次性绑定
        function onceClickSaveRange() {
            saveRange();
            $textElem.off('click', onceClickSaveRange);
        }
        $textElem.on('click', onceClickSaveRange);
        function handleMouseUp() {
            // 在编辑器区域之外完成抬起，保存此时编辑区内的新选区，取消此时鼠标抬起事件
            saveRange();
            $document.off('mouseup', handleMouseUp);
        }
        function listenMouseLeave() {
            // 当鼠标移动到外面，要监听鼠标抬起操作
            $document.on('mouseup', handleMouseUp);
            // 首次移出时即接触leave监听，防止用户不断移入移出多次注册handleMouseUp
            $textElem.off('mouseleave', listenMouseLeave);
        }
        $textElem.on('mousedown', function () {
            // mousedown 状态下，要坚听鼠标滑动到编辑区域外面
            $textElem.on('mouseleave', listenMouseLeave);
        });
        $textElem.on('mouseup', function (e) {
            // 记得移除$textElem的mouseleave事件, 避免内存泄露
            $textElem.off('mouseleave', listenMouseLeave);
            // fix：避免当选中一段文字之后，再次点击文字中间位置无法更新selection问题。issue#3096
            setTimeout(function () {
                var selection = editor.selection;
                var range = selection.getRange();
                if (range === null)
                    return;
                saveRange();
            }, 0);
        });
    };
    /**
     * 绑定事件，事件会触发钩子函数
     */
    Text.prototype._bindEventHooks = function () {
        var editor = this.editor;
        var $textElem = editor.$textElem;
        var eventHooks = this.eventHooks;
        // click hooks
        $textElem.on('click', function (e) {
            var clickEvents = eventHooks.clickEvents;
            clickEvents.forEach(function (fn) { return fn(e); });
        });
        // enter 键 up 时的 hooks
        $textElem.on('keyup', function (e) {
            if (e.keyCode !== 13)
                return;
            var enterUpEvents = eventHooks.enterUpEvents;
            enterUpEvents.forEach(function (fn) { return fn(e); });
        });
        // 键盘 up 时的 hooks
        $textElem.on('keyup', function (e) {
            var keyupEvents = eventHooks.keyupEvents;
            keyupEvents.forEach(function (fn) { return fn(e); });
        });
        // 键盘 down 时的 hooks
        $textElem.on('keydown', function (e) {
            var keydownEvents = eventHooks.keydownEvents;
            keydownEvents.forEach(function (fn) { return fn(e); });
        });
        // delete 键 up 时 hooks
        $textElem.on('keyup', function (e) {
            if (e.keyCode !== 8 && e.keyCode !== 46)
                return;
            var deleteUpEvents = eventHooks.deleteUpEvents;
            deleteUpEvents.forEach(function (fn) { return fn(e); });
        });
        // delete 键 down 时 hooks
        $textElem.on('keydown', function (e) {
            if (e.keyCode !== 8 && e.keyCode !== 46)
                return;
            var deleteDownEvents = eventHooks.deleteDownEvents;
            deleteDownEvents.forEach(function (fn) { return fn(e); });
        });
        // 粘贴
        $textElem.on('paste', function (e) {
            if (util_1.UA.isIE())
                return; // IE 不支持
            // 阻止默认行为，使用 execCommand 的粘贴命令
            e.preventDefault();
            var pasteEvents = eventHooks.pasteEvents;
            pasteEvents.forEach(function (fn) { return fn(e); });
        });
        // 撤销/恢复 快捷键
        $textElem.on('keydown', function (e) {
            if (
            // 编辑器处于聚焦状态下（多编辑器实例） || 当前处于兼容模式（兼容模式撤销/恢复后不聚焦，所以直接过，但会造成多编辑器同时撤销/恢复）
            (editor.isFocus || editor.isCompatibleMode) &&
                (e.ctrlKey || e.metaKey) &&
                e.keyCode === 90) {
                // 取消默认行为
                e.preventDefault();
                // 执行事件
                if (e.shiftKey) {
                    // 恢复
                    editor.history.restore();
                }
                else {
                    // 撤销
                    editor.history.revoke();
                }
            }
        });
        // tab up
        $textElem.on('keyup', function (e) {
            if (e.keyCode !== 9)
                return;
            e.preventDefault();
            var tabUpEvents = eventHooks.tabUpEvents;
            tabUpEvents.forEach(function (fn) { return fn(e); });
        });
        // tab down
        $textElem.on('keydown', function (e) {
            if (e.keyCode !== 9)
                return;
            e.preventDefault();
            var tabDownEvents = eventHooks.tabDownEvents;
            tabDownEvents.forEach(function (fn) { return fn(e); });
        });
        // 文本编辑区域 滚动时触发
        $textElem.on('scroll', 
        // 使用节流
        util_1.throttle(function (e) {
            var textScrollEvents = eventHooks.textScrollEvents;
            textScrollEvents.forEach(function (fn) { return fn(e); });
        }, 100));
        // 拖拽相关的事件
        function preventDefault(e) {
            // 禁用 document 拖拽事件
            e.preventDefault();
        }
        dom_core_1.default(document)
            .on('dragleave', preventDefault)
            .on('drop', preventDefault)
            .on('dragenter', preventDefault)
            .on('dragover', preventDefault);
        // 全局事件在编辑器实例销毁的时候进行解绑
        editor.beforeDestroy(function () {
            dom_core_1.default(document)
                .off('dragleave', preventDefault)
                .off('drop', preventDefault)
                .off('dragenter', preventDefault)
                .off('dragover', preventDefault);
        });
        $textElem.on('drop', function (e) {
            e.preventDefault();
            var events = eventHooks.dropEvents;
            events.forEach(function (fn) { return fn(e); });
        });
        // link click
        $textElem.on('click', function (e) {
            // 存储链接元素
            var $link = null;
            var target = e.target;
            var $target = dom_core_1.default(target);
            if ($target.getNodeName() === 'A') {
                // 当前点击的就是一个链接
                $link = $target;
            }
            else {
                // 否则，向父节点中寻找链接
                var $parent = $target.parentUntil('a');
                if ($parent != null) {
                    // 找到了
                    $link = $parent;
                }
            }
            if (!$link)
                return; // 没有点击链接，则返回
            var linkClickEvents = eventHooks.linkClickEvents;
            linkClickEvents.forEach(function (fn) { return fn($link); });
        });
        // img click
        $textElem.on('click', function (e) {
            // 存储图片元素
            var $img = null;
            var target = e.target;
            var $target = dom_core_1.default(target);
            //处理图片点击 去除掉emoji图片的情况
            if ($target.getNodeName() === 'IMG' && !$target.elems[0].getAttribute('data-emoji')) {
                // 当前点击的就是img
                e.stopPropagation();
                $img = $target;
            }
            if (!$img)
                return; // 没有点击图片，则返回
            var imgClickEvents = eventHooks.imgClickEvents;
            imgClickEvents.forEach(function (fn) { return fn($img); });
        });
        // code click
        $textElem.on('click', function (e) {
            // 存储代码元素
            var $code = null;
            var target = e.target;
            var $target = dom_core_1.default(target);
            if ($target.getNodeName() === 'PRE') {
                // 当前点击的就是一个链接
                $code = $target;
            }
            else {
                // 否则，向父节点中寻找链接
                var $parent = $target.parentUntil('pre');
                if ($parent !== null) {
                    // 找到了
                    $code = $parent;
                }
            }
            if (!$code)
                return;
            var codeClickEvents = eventHooks.codeClickEvents;
            codeClickEvents.forEach(function (fn) { return fn($code); });
        });
        // splitLine click
        $textElem.on('click', function (e) {
            // 存储分割线元素
            var $splitLine = null;
            var target = e.target;
            var $target = dom_core_1.default(target);
            // 判断当前点击元素
            if ($target.getNodeName() === 'HR') {
                $splitLine = $target;
            }
            else {
                $target == null;
            }
            if (!$splitLine)
                return; // 没有点击分割线，则返回
            // 设置、恢复选区
            editor.selection.createRangeByElem($splitLine);
            editor.selection.restoreSelection();
            var splitLineClickEvents = eventHooks.splitLineEvents;
            splitLineClickEvents.forEach(function (fn) { return fn($splitLine); });
        });
        // 菜单栏被点击
        editor.$toolbarElem.on('click', function (e) {
            var toolbarClickEvents = eventHooks.toolbarClickEvents;
            toolbarClickEvents.forEach(function (fn) { return fn(e); });
        });
        //mousedown事件
        editor.$textContainerElem.on('mousedown', function (e) {
            var target = e.target;
            var $target = dom_core_1.default(target);
            if ($target.hasClass('w-e-img-drag-rb')) {
                // 点击的元素，是图片拖拽调整大小的 bar
                var imgDragBarMouseDownEvents = eventHooks.imgDragBarMouseDownEvents;
                imgDragBarMouseDownEvents.forEach(function (fn) { return fn(); });
            }
        });
        //table click
        $textElem.on('click', function (e) {
            // 存储元素
            var $dom = null;
            var target = e.target;
            //获取最祖父元素
            $dom = dom_core_1.default(target).parentUntilEditor('TABLE', editor, target);
            // 没有table范围内，则返回
            if (!$dom)
                return;
            var tableClickEvents = eventHooks.tableClickEvents;
            tableClickEvents.forEach(function (fn) { return fn($dom, e); });
        });
        // enter 键 down
        $textElem.on('keydown', function (e) {
            if (e.keyCode !== 13)
                return;
            var enterDownEvents = eventHooks.enterDownEvents;
            enterDownEvents.forEach(function (fn) { return fn(e); });
        });
        // 视频 click
        $textElem.on('click', function (e) {
            // 存储视频
            var $video = null;
            var target = e.target;
            var $target = dom_core_1.default(target);
            //处理视频点击 简单的video 标签
            if ($target.getNodeName() === 'VIDEO') {
                // 当前点击的就是视频
                e.stopPropagation();
                $video = $target;
            }
            if (!$video)
                return; // 没有点击视频，则返回
            var videoClickEvents = eventHooks.videoClickEvents;
            videoClickEvents.forEach(function (fn) { return fn($video); });
        });
    };
    return Text;
}());
exports.default = Text;
//# sourceMappingURL=index.js.map