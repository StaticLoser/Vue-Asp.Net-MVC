"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
require("../../assets/style/disable.less");
function disableInit(editor) {
    var isCurtain = false; // 避免重复生成幕布
    var $contentDom;
    var $menuDom;
    // 禁用期间，通过 js 修改内容后，刷新内容
    editor.txt.eventHooks.changeEvents.push(function () {
        if (isCurtain) {
            $contentDom.find('.w-e-content-preview').html(editor.$textElem.html());
        }
    });
    // 创建幕布
    function disable() {
        if (isCurtain)
            return;
        // 隐藏编辑区域
        editor.$textElem.hide();
        // 生成div 渲染编辑内容
        var textContainerZindexValue = editor.zIndex.get('textContainer');
        var content = editor.txt.html();
        $contentDom = dom_core_1.default("<div class=\"w-e-content-mantle\" style=\"z-index:" + textContainerZindexValue + "\">\n                <div class=\"w-e-content-preview w-e-text\">" + content + "</div>\n            </div>");
        editor.$textContainerElem.append($contentDom);
        // 生成div 菜单膜布
        var menuZindexValue = editor.zIndex.get('menu');
        $menuDom = dom_core_1.default("<div class=\"w-e-menue-mantle\" style=\"z-index:" + menuZindexValue + "\"></div>");
        editor.$toolbarElem.append($menuDom);
        isCurtain = true;
        editor.isEnable = false;
    }
    // 销毁幕布并显示可编辑区域
    function enable() {
        if (!isCurtain)
            return;
        $contentDom.remove();
        $menuDom.remove();
        editor.$textElem.show();
        isCurtain = false;
        editor.isEnable = true;
    }
    return { disable: disable, enable: enable };
}
exports.default = disableInit;
//# sourceMappingURL=index.js.map