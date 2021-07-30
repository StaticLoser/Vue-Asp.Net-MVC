"use strict";
/**
 * @description video 菜单 panel tab 配置
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../utils/util");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var upload_video_1 = tslib_1.__importDefault(require("./upload-video"));
var const_1 = require("../../utils/const");
function default_1(editor, video) {
    var config = editor.config;
    var uploadVideo = new upload_video_1.default(editor);
    // panel 中需要用到的id
    var inputIFrameId = util_1.getRandom('input-iframe');
    var btnOkId = util_1.getRandom('btn-ok');
    var inputUploadId = util_1.getRandom('input-upload');
    var btnStartId = util_1.getRandom('btn-local-ok');
    /**
     * 插入链接
     * @param iframe html标签
     */
    function insertVideo(video) {
        editor.cmd.do('insertHTML', video + const_1.EMPTY_P);
        // video添加后的回调
        editor.config.onlineVideoCallback(video);
    }
    /**
     * 校验在线视频链接
     * @param video 在线视频链接
     */
    function checkOnlineVideo(video) {
        // 查看开发者自定义配置的返回值
        var check = editor.config.onlineVideoCheck(video);
        if (check === true) {
            return true;
        }
        if (typeof check === 'string') {
            //用户未能通过开发者的校验，开发者希望我们提示这一字符串
            editor.config.customAlert(check, 'error');
        }
        return false;
    }
    // tabs配置
    // const fileMultipleAttr = config.uploadVideoMaxLength === 1 ? '' : 'multiple="multiple"'
    var tabsConf = [
        {
            // tab 的标题
            title: editor.i18next.t('menus.panelMenus.video.上传视频'),
            tpl: "<div class=\"w-e-up-video-container\">\n                    <div id=\"" + btnStartId + "\" class=\"w-e-up-btn\">\n                        <i class=\"w-e-icon-upload2\"></i>\n                    </div>\n                    <div style=\"display:none;\">\n                        <input id=\"" + inputUploadId + "\" type=\"file\" accept=\"video/*\"/>\n                    </div>\n                 </div>",
            events: [
                // 触发选择视频
                {
                    selector: '#' + btnStartId,
                    type: 'click',
                    fn: function () {
                        var $file = dom_core_1.default('#' + inputUploadId);
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
                // 选择视频完毕
                {
                    selector: '#' + inputUploadId,
                    type: 'change',
                    fn: function () {
                        var $file = dom_core_1.default('#' + inputUploadId);
                        var fileElem = $file.elems[0];
                        if (!fileElem) {
                            // 返回 true 可关闭 panel
                            return true;
                        }
                        // 获取选中的 file 对象列表
                        var fileList = fileElem.files;
                        if (fileList.length) {
                            uploadVideo.uploadVideo(fileList);
                        }
                        // 返回 true 可关闭 panel
                        return true;
                    },
                },
            ],
        },
        {
            // tab 的标题
            title: editor.i18next.t('menus.panelMenus.video.插入视频'),
            // 模板
            tpl: "<div>\n                    <input \n                        id=\"" + inputIFrameId + "\" \n                        type=\"text\" \n                        class=\"block\" \n                        placeholder=\"" + editor.i18next.t('如') + "\uFF1A<iframe src=... ></iframe>\"/>\n                    </td>\n                    <div class=\"w-e-button-container\">\n                        <button type=\"button\" id=\"" + btnOkId + "\" class=\"right\">\n                            " + editor.i18next.t('插入') + "\n                        </button>\n                    </div>\n                </div>",
            // 事件绑定
            events: [
                // 插入视频
                {
                    selector: '#' + btnOkId,
                    type: 'click',
                    fn: function () {
                        // 执行插入视频
                        var $video = dom_core_1.default('#' + inputIFrameId);
                        var video = $video.val().trim();
                        // 视频为空，则不插入
                        if (!video)
                            return;
                        // 对当前用户插入的内容进行判断，插入为空，或者返回false，都停止插入
                        if (!checkOnlineVideo(video))
                            return;
                        insertVideo(video);
                        // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                        return true;
                    },
                },
            ],
        },
    ];
    var conf = {
        width: 300,
        height: 0,
        // panel 中可包含多个 tab
        tabs: [],
    };
    // 显示“上传视频”
    if (window.FileReader && (config.uploadVideoServer || config.customUploadVideo)) {
        conf.tabs.push(tabsConf[0]);
    }
    // 显示“插入视频”
    if (config.showLinkVideo) {
        conf.tabs.push(tabsConf[1]);
    }
    return conf;
}
exports.default = default_1;
//# sourceMappingURL=create-panel-conf.js.map