"use strict";
/**
 * @description image 菜单 panel tab 配置
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var util_1 = require("../../utils/util");
var upload_img_1 = tslib_1.__importDefault(require("./upload-img"));
function default_1(editor) {
    var config = editor.config;
    var uploadImg = new upload_img_1.default(editor);
    // panel 中需要用到的id
    var upTriggerId = util_1.getRandom('up-trigger-id');
    var upFileId = util_1.getRandom('up-file-id');
    var linkUrlId = util_1.getRandom('input-link-url');
    var linkUrlAltId = util_1.getRandom('input-link-url-alt');
    var linkUrlHrefId = util_1.getRandom('input-link-url-href');
    var linkBtnId = util_1.getRandom('btn-link');
    var i18nPrefix = 'menus.panelMenus.image.';
    var t = function (text, prefix) {
        if (prefix === void 0) { prefix = i18nPrefix; }
        return editor.i18next.t(prefix + text);
    };
    /**
     * 校验网络图片链接是否合法
     * @param linkImg 网络图片链接
     */
    function checkLinkImg(src, linkUrlAltText, linkUrlHrefText) {
        //查看开发者自定义配置的返回值
        var check = config.linkImgCheck(src);
        if (check === true) {
            return true;
        }
        else if (typeof check === 'string') {
            //用户未能通过开发者的校验，开发者希望我们提示这一字符串
            config.customAlert(check, 'error');
        }
        return false;
    }
    // tabs 配置 -----------------------------------------
    var fileMultipleAttr = config.uploadImgMaxLength === 1 ? '' : 'multiple="multiple"';
    var accepts = config.uploadImgAccept.map(function (item) { return "image/" + item; }).join(',');
    /**
     * 设置模板的类名和icon图标
     * w-e-menu是作为button菜单的模板
     * w-e-up-img-container是做为panel菜单的窗口内容的模板
     * @param containerClass 模板最外层的类名
     * @param iconClass 模板中icon的类名
     * @param titleName 模板中标题的名称 需要则设置不需要则设为空字符
     */
    var getUploadImgTpl = function (containerClass, iconClass, titleName) {
        return "<div class=\"" + containerClass + "\" data-title=\"" + titleName + "\">\n            <div id=\"" + upTriggerId + "\" class=\"w-e-up-btn\">\n                <i class=\"" + iconClass + "\"></i>\n            </div>\n            <div style=\"display:none;\">\n                <input id=\"" + upFileId + "\" type=\"file\" " + fileMultipleAttr + " accept=\"" + accepts + "\"/>\n            </div>\n        </div>";
    };
    var uploadEvents = [
        // 触发选择图片
        {
            selector: '#' + upTriggerId,
            type: 'click',
            fn: function () {
                var uploadImgFromMedia = config.uploadImgFromMedia;
                if (uploadImgFromMedia && typeof uploadImgFromMedia === 'function') {
                    uploadImgFromMedia();
                    return true;
                }
                var $file = dom_core_1.default('#' + upFileId);
                var fileElem = $file.elems[0];
                if (fileElem) {
                    fileElem.click();
                }
                else {
                    // 返回 true 可关闭 panel
                    return true;
                }
            },
        },
        // 选择图片完毕
        {
            selector: '#' + upFileId,
            type: 'change',
            fn: function () {
                var $file = dom_core_1.default('#' + upFileId);
                var fileElem = $file.elems[0];
                if (!fileElem) {
                    // 返回 true 可关闭 panel
                    return true;
                }
                // 获取选中的 file 对象列表
                var fileList = fileElem.files;
                if (fileList === null || fileList === void 0 ? void 0 : fileList.length) {
                    uploadImg.uploadImg(fileList);
                }
                // 判断用于打开文件的input，有没有值，如果有就清空，以防上传同一张图片时，不会触发change事件
                // input的功能只是单单为了打开文件而已，获取到需要的文件参数，当文件数据获取到后，可以清空。
                if (fileElem) {
                    fileElem.value = '';
                }
                // 返回 true 可关闭 panel
                return true;
            },
        },
    ];
    var linkImgInputs = [
        "<input\n            id=\"" + linkUrlId + "\"\n            type=\"text\"\n            class=\"block\"\n            placeholder=\"" + t('图片地址') + "\"/>",
    ];
    if (config.showLinkImgAlt) {
        linkImgInputs.push("\n        <input\n            id=\"" + linkUrlAltId + "\"\n            type=\"text\"\n            class=\"block\"\n            placeholder=\"" + t('图片文字说明') + "\"/>");
    }
    if (config.showLinkImgHref) {
        linkImgInputs.push("\n        <input\n            id=\"" + linkUrlHrefId + "\"\n            type=\"text\"\n            class=\"block\"\n            placeholder=\"" + t('跳转链接') + "\"/>");
    }
    var tabsConf = [
        // first tab
        {
            // 标题
            title: t('上传图片'),
            // 模板
            tpl: getUploadImgTpl('w-e-up-img-container', 'w-e-icon-upload2', ''),
            // 事件绑定
            events: uploadEvents,
        },
        // second tab
        {
            title: t('网络图片'),
            tpl: "<div>\n                    " + linkImgInputs.join('') + "\n                    <div class=\"w-e-button-container\">\n                        <button type=\"button\" id=\"" + linkBtnId + "\" class=\"right\">" + t('插入', '') + "</button>\n                    </div>\n                </div>",
            events: [
                {
                    selector: '#' + linkBtnId,
                    type: 'click',
                    fn: function () {
                        var $linkUrl = dom_core_1.default('#' + linkUrlId);
                        var url = $linkUrl.val().trim();
                        //如果url为空则直接返回
                        if (!url)
                            return;
                        var linkUrlAltText;
                        if (config.showLinkImgAlt) {
                            linkUrlAltText = dom_core_1.default('#' + linkUrlAltId)
                                .val()
                                .trim();
                        }
                        var linkUrlHrefText;
                        if (config.showLinkImgHref) {
                            linkUrlHrefText = dom_core_1.default('#' + linkUrlHrefId)
                                .val()
                                .trim();
                        }
                        //如果不能通过校验也直接返回
                        if (!checkLinkImg(url, linkUrlAltText, linkUrlHrefText))
                            return;
                        //插入图片url
                        uploadImg.insertImg(url, linkUrlAltText, linkUrlHrefText);
                        // 返回 true 表示函数执行结束之后关闭 panel
                        return true;
                    },
                },
            ],
        },
    ];
    // tabs end
    // 最终的配置 -----------------------------------------
    var conf = {
        width: 300,
        height: 0,
        tabs: [],
        onlyUploadConf: {
            $elem: dom_core_1.default(getUploadImgTpl('w-e-menu', 'w-e-icon-image', '图片')),
            events: uploadEvents,
        },
    };
    // 显示“上传图片”
    if (window.FileReader &&
        (config.uploadImgShowBase64 ||
            config.uploadImgServer ||
            config.customUploadImg ||
            config.uploadImgFromMedia)) {
        conf.tabs.push(tabsConf[0]);
    }
    // 显示“插入网络图片”
    if (config.showLinkImg) {
        conf.tabs.push(tabsConf[1]);
        conf.onlyUploadConf = undefined;
    }
    return conf;
}
exports.default = default_1;
//# sourceMappingURL=create-panel-conf.js.map