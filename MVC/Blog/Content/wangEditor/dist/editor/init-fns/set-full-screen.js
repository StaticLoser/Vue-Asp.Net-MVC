"use strict";
/**
 * @description 全屏功能
 * @author xiaokyo
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUnFullScreen = exports.setFullScreen = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
require("../../assets/style/full-screen.less");
var iconFullScreenText = 'w-e-icon-fullscreen'; // 全屏icon class
var iconExitFullScreenText = 'w-e-icon-fullscreen_exit'; // 退出全屏icon class
var classfullScreenEditor = 'w-e-full-screen-editor'; // 全屏添加至编辑器的class
/**
 * 设置全屏
 * @param editor 编辑器实例
 */
var setFullScreen = function (editor) {
    var $editorParent = dom_core_1.default(editor.toolbarSelector);
    var $textContainerElem = editor.$textContainerElem;
    var $toolbarElem = editor.$toolbarElem;
    var $iconElem = $toolbarElem.find("i." + iconFullScreenText);
    var config = editor.config;
    $iconElem.removeClass(iconFullScreenText);
    $iconElem.addClass(iconExitFullScreenText);
    $editorParent.addClass(classfullScreenEditor);
    $editorParent.css('z-index', config.zIndexFullScreen);
    var bar = $toolbarElem.getBoundingClientRect();
    $textContainerElem.css('height', "calc(100% - " + bar.height + "px)");
};
exports.setFullScreen = setFullScreen;
/**
 * 取消全屏
 * @param editor 编辑器实例
 */
var setUnFullScreen = function (editor) {
    var $editorParent = dom_core_1.default(editor.toolbarSelector);
    var $textContainerElem = editor.$textContainerElem;
    var $toolbarElem = editor.$toolbarElem;
    var $iconElem = $toolbarElem.find("i." + iconExitFullScreenText);
    var config = editor.config;
    $iconElem.removeClass(iconExitFullScreenText);
    $iconElem.addClass(iconFullScreenText);
    $editorParent.removeClass(classfullScreenEditor);
    $editorParent.css('z-index', 'auto');
    $textContainerElem.css('height', config.height + 'px');
};
exports.setUnFullScreen = setUnFullScreen;
/**
 * 初始化全屏功能
 * @param editor 编辑器实例
 */
var initFullScreen = function (editor) {
    // 当textSelector有值的时候，也就是编辑器是工具栏和编辑区域分离的情况， 则不生成全屏功能按钮
    if (editor.textSelector)
        return;
    if (!editor.config.showFullScreen)
        return;
    var $toolbarElem = editor.$toolbarElem;
    var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u5168\u5C4F\">\n            <i class=\"" + iconFullScreenText + "\"></i>\n        </div>");
    $elem.on('click', function (e) {
        var $elemIcon = dom_core_1.default(e.currentTarget).find('i');
        if ($elemIcon.hasClass(iconFullScreenText)) {
            $elem.attr('data-title', '取消全屏');
            exports.setFullScreen(editor);
        }
        else {
            $elem.attr('data-title', '全屏');
            exports.setUnFullScreen(editor);
        }
    });
    $toolbarElem.append($elem);
};
exports.default = initFullScreen;
//# sourceMappingURL=set-full-screen.js.map