"use strict";
/**
 * @description 图片拖拽事件绑定
 * @author xiaokyo
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShowHideFn = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
require("../../../assets/style/drag-size.less");
var util_1 = require("../../../utils/util");
/**
 * 设置拖拽框的rect
 * @param $drag drag Dom
 * @param width 要设置的宽度
 * @param height 要设置的高度
 * @param left 要设置的左边
 * @param top 要设置的顶部距离
 */
function setDragStyle($drag, width, height, left, top) {
    $drag.attr('style', "width:" + width + "px; height:" + height + "px; left:" + left + "px; top:" + top + "px;");
}
/**
 * 生成一个图片指定大小的拖拽框
 * @param editor 编辑器实例
 * @param $textContainerElem 编辑框对象
 */
function createDragBox(editor, $textContainerElem) {
    var $drag = dom_core_1.default("<div class=\"w-e-img-drag-mask\">\n            <div class=\"w-e-img-drag-show-size\"></div>\n            <div class=\"w-e-img-drag-rb\"></div>\n         </div>");
    $drag.hide();
    $textContainerElem.append($drag);
    return $drag;
}
/**
 * 显示拖拽框并设置宽度
 * @param $textContainerElem 编辑框实例
 * @param $drag 拖拽框对象
 */
function showDargBox($textContainerElem, $drag, $img) {
    var boxRect = $textContainerElem.getBoundingClientRect();
    var rect = $img.getBoundingClientRect();
    var rectW = rect.width.toFixed(2);
    var rectH = rect.height.toFixed(2);
    $drag.find('.w-e-img-drag-show-size').text(rectW + "px * " + rectH + "px");
    setDragStyle($drag, parseFloat(rectW), parseFloat(rectH), rect.left - boxRect.left, rect.top - boxRect.top);
    $drag.show();
}
/**
 * 生成图片拖拽框的 显示/隐藏 函数
 */
function createShowHideFn(editor) {
    var $textContainerElem = editor.$textContainerElem;
    var $imgTarget;
    // 生成拖拽框
    var $drag = createDragBox(editor, $textContainerElem);
    /**
     * 设置拖拽事件
     * @param $drag 拖拽框的domElement
     * @param $textContainerElem 编辑器实例
     */
    function bindDragEvents($drag, $container) {
        $drag.on('click', function (e) {
            e.stopPropagation();
        });
        $drag.on('mousedown', '.w-e-img-drag-rb', function (e) {
            // e.stopPropagation()
            e.preventDefault();
            if (!$imgTarget)
                return;
            var firstX = e.clientX;
            var firstY = e.clientY;
            var boxRect = $container.getBoundingClientRect();
            var imgRect = $imgTarget.getBoundingClientRect();
            var width = imgRect.width;
            var height = imgRect.height;
            var left = imgRect.left - boxRect.left;
            var top = imgRect.top - boxRect.top;
            var ratio = width / height;
            var setW = width;
            var setH = height;
            var $document = dom_core_1.default(document);
            function offEvents() {
                $document.off('mousemove', mouseMoveHandler);
                $document.off('mouseup', mouseUpHandler);
            }
            function mouseMoveHandler(ev) {
                ev.stopPropagation();
                ev.preventDefault();
                setW = width + (ev.clientX - firstX);
                setH = height + (ev.clientY - firstY);
                // 等比计算
                if (setW / setH != ratio) {
                    setH = setW / ratio;
                }
                setW = parseFloat(setW.toFixed(2));
                setH = parseFloat(setH.toFixed(2));
                $drag
                    .find('.w-e-img-drag-show-size')
                    .text(setW.toFixed(2).replace('.00', '') + "px * " + setH
                    .toFixed(2)
                    .replace('.00', '') + "px");
                setDragStyle($drag, setW, setH, left, top);
            }
            $document.on('mousemove', mouseMoveHandler);
            function mouseUpHandler() {
                $imgTarget.attr('width', setW + '');
                $imgTarget.attr('height', setH + '');
                var newImgRect = $imgTarget.getBoundingClientRect();
                setDragStyle($drag, setW, setH, newImgRect.left - boxRect.left, newImgRect.top - boxRect.top);
                // 解绑事件
                offEvents();
            }
            $document.on('mouseup', mouseUpHandler);
            // 解绑事件
            $document.on('mouseleave', offEvents);
        });
    }
    // 显示拖拽框
    function showDrag($target) {
        if (util_1.UA.isIE())
            return false;
        if ($target) {
            $imgTarget = $target;
            showDargBox($textContainerElem, $drag, $imgTarget);
        }
    }
    // 隐藏拖拽框
    function hideDrag() {
        $textContainerElem.find('.w-e-img-drag-mask').hide();
    }
    // 事件绑定
    bindDragEvents($drag, $textContainerElem);
    // 后期改成 blur 触发
    dom_core_1.default(document).on('click', hideDrag);
    editor.beforeDestroy(function () {
        dom_core_1.default(document).off('click', hideDrag);
    });
    return {
        showDrag: showDrag,
        hideDrag: hideDrag,
    };
}
exports.createShowHideFn = createShowHideFn;
/**
 * 点击事件委托
 * @param editor 编辑器实例
 */
function bindDragImgSize(editor) {
    var _a = createShowHideFn(editor), showDrag = _a.showDrag, hideDrag = _a.hideDrag;
    // 显示拖拽框
    editor.txt.eventHooks.imgClickEvents.push(showDrag);
    // 隐藏拖拽框
    editor.txt.eventHooks.textScrollEvents.push(hideDrag);
    editor.txt.eventHooks.keyupEvents.push(hideDrag);
    editor.txt.eventHooks.toolbarClickEvents.push(hideDrag);
    editor.txt.eventHooks.menuClickEvents.push(hideDrag);
    editor.txt.eventHooks.changeEvents.push(hideDrag);
}
exports.default = bindDragImgSize;
//# sourceMappingURL=drag-size.js.map