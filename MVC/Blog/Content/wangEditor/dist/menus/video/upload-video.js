"use strict";
/**
 * @description 上传视频
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../utils/util");
var upload_core_1 = tslib_1.__importDefault(require("../../editor/upload/upload-core"));
var progress_1 = tslib_1.__importDefault(require("../../editor/upload/progress"));
var const_1 = require("../../utils/const");
var util_2 = require("../../utils/util");
var UploadVideo = /** @class */ (function () {
    function UploadVideo(editor) {
        this.editor = editor;
    }
    /**
     * 上传视频
     * @param files 文件列表
     */
    UploadVideo.prototype.uploadVideo = function (files) {
        var _this = this;
        if (!files.length) {
            return;
        }
        var editor = this.editor;
        var config = editor.config;
        // ------------------------------ i18next ------------------------------
        var i18nPrefix = 'validate.';
        var t = function (text) {
            return editor.i18next.t(i18nPrefix + text);
        };
        // ------------------------------ 获取配置信息 ------------------------------
        // 服务端地址
        var uploadVideoServer = config.uploadVideoServer;
        // 上传视频的最大体积，默认 1024M
        var maxSize = config.uploadVideoMaxSize;
        var uploadVideoMaxSize = maxSize / 1024;
        // 一次最多上传多少个视频
        // const uploadVideoMaxLength = config.uploadVideoMaxLength
        // 自定义上传视频的名称
        var uploadVideoName = config.uploadVideoName;
        // 上传视频自定义参数
        var uploadVideoParams = config.uploadVideoParams;
        // 自定义参数拼接到 url 中
        var uploadVideoParamsWithUrl = config.uploadVideoParamsWithUrl;
        // 上传视频自定义 header
        var uploadVideoHeaders = config.uploadVideoHeaders;
        // 钩子函数
        var uploadVideoHooks = config.uploadVideoHooks;
        // 上传视频超时时间 ms 默认2个小时
        var uploadVideoTimeout = config.uploadVideoTimeout;
        // 跨域带 cookie
        var withVideoCredentials = config.withVideoCredentials;
        // 自定义上传
        var customUploadVideo = config.customUploadVideo;
        // 格式校验
        var uploadVideoAccept = config.uploadVideoAccept;
        // ------------------------------ 验证文件信息 ------------------------------
        var resultFiles = [];
        var errInfos = [];
        util_1.arrForEach(files, function (file) {
            var name = file.name;
            var size = file.size / 1024 / 1024;
            // chrome 低版本 name === undefined
            if (!name || !size) {
                return;
            }
            if (!(uploadVideoAccept instanceof Array)) {
                // 格式不是数组
                errInfos.push("\u3010" + uploadVideoAccept + "\u3011" + t('uploadVideoAccept 不是Array'));
                return;
            }
            if (!uploadVideoAccept.some(function (item) { return item === name.split('.')[name.split('.').length - 1]; })) {
                // 后缀名不合法，不是视频
                errInfos.push("\u3010" + name + "\u3011" + t('不是视频'));
                return;
            }
            if (uploadVideoMaxSize < size) {
                // 上传视频过大
                errInfos.push("\u3010" + name + "\u3011" + t('大于') + " " + uploadVideoMaxSize + "M");
                return;
            }
            //验证通过的加入结果列表
            resultFiles.push(file);
        });
        // 抛出验证信息
        if (errInfos.length) {
            config.customAlert(t('视频验证未通过') + ": \n" + errInfos.join('\n'), 'warning');
            return;
        }
        // 如果过滤后文件列表为空直接返回
        if (resultFiles.length === 0) {
            config.customAlert(t('传入的文件不合法'), 'warning');
            return;
        }
        // ------------------------------ 自定义上传 ------------------------------
        if (customUploadVideo && typeof customUploadVideo === 'function') {
            customUploadVideo(resultFiles, this.insertVideo.bind(this));
            return;
        }
        // 添加视频数据
        var formData = new FormData();
        resultFiles.forEach(function (file, index) {
            var name = uploadVideoName || file.name;
            if (resultFiles.length > 1) {
                // 多个文件时，filename 不能重复
                name = name + (index + 1);
            }
            formData.append(name, file);
        });
        // ------------------------------ 上传视频 ------------------------------
        //添加自定义参数  基于有服务端地址的情况下
        if (uploadVideoServer) {
            // 添加自定义参数
            var uploadVideoServerArr = uploadVideoServer.split('#');
            uploadVideoServer = uploadVideoServerArr[0];
            var uploadVideoServerHash = uploadVideoServerArr[1] || '';
            util_1.forEach(uploadVideoParams, function (key, val) {
                // 因使用者反应，自定义参数不能默认 encode ，由 v3.1.1 版本开始注释掉
                // val = encodeURIComponent(val)
                // 第一，将参数拼接到 url 中
                if (uploadVideoParamsWithUrl) {
                    if (uploadVideoServer.indexOf('?') > 0) {
                        uploadVideoServer += '&';
                    }
                    else {
                        uploadVideoServer += '?';
                    }
                    uploadVideoServer = uploadVideoServer + key + '=' + val;
                }
                // 第二，将参数添加到 formData 中
                formData.append(key, val);
            });
            if (uploadVideoServerHash) {
                uploadVideoServer += '#' + uploadVideoServerHash;
            }
            // 开始上传
            var xhr = upload_core_1.default(uploadVideoServer, {
                timeout: uploadVideoTimeout,
                formData: formData,
                headers: uploadVideoHeaders,
                withCredentials: !!withVideoCredentials,
                beforeSend: function (xhr) {
                    if (uploadVideoHooks.before)
                        return uploadVideoHooks.before(xhr, editor, resultFiles);
                },
                onTimeout: function (xhr) {
                    config.customAlert(t('上传视频超时'), 'error');
                    if (uploadVideoHooks.timeout)
                        uploadVideoHooks.timeout(xhr, editor);
                },
                onProgress: function (percent, e) {
                    var progressBar = new progress_1.default(editor);
                    if (e.lengthComputable) {
                        percent = e.loaded / e.total;
                        progressBar.show(percent);
                    }
                },
                onError: function (xhr) {
                    config.customAlert(t('上传视频错误'), 'error', t('上传视频错误') + "\uFF0C" + t('服务器返回状态') + ": " + xhr.status);
                    if (uploadVideoHooks.error)
                        uploadVideoHooks.error(xhr, editor);
                },
                onFail: function (xhr, resultStr) {
                    config.customAlert(t('上传视频失败'), 'error', t('上传视频返回结果错误') + ("\uFF0C" + t('返回结果') + ": ") + resultStr);
                    if (uploadVideoHooks.fail)
                        uploadVideoHooks.fail(xhr, editor, resultStr);
                },
                onSuccess: function (xhr, result) {
                    if (uploadVideoHooks.customInsert) {
                        // 自定义插入视频
                        uploadVideoHooks.customInsert(_this.insertVideo.bind(_this), result, editor);
                        return;
                    }
                    if (result.errno != '0') {
                        // 返回格式不对，应该为 { errno: 0, data: [...] }
                        config.customAlert(t('上传视频失败'), 'error', t('上传视频返回结果错误') + "\uFF0C" + t('返回结果') + " errno=" + result.errno);
                        if (uploadVideoHooks.fail)
                            uploadVideoHooks.fail(xhr, editor, result);
                        return;
                    }
                    // 成功，插入视频
                    var data = result.data;
                    _this.insertVideo(data.url);
                    // 钩子函数
                    if (uploadVideoHooks.success)
                        uploadVideoHooks.success(xhr, editor, result);
                },
            });
            if (typeof xhr === 'string') {
                // 上传被阻止
                config.customAlert(xhr, 'error');
            }
        }
    };
    /**
     * 往编辑器区域插入视频
     * @param url 视频访问地址
     */
    UploadVideo.prototype.insertVideo = function (url) {
        var editor = this.editor;
        var config = editor.config;
        var i18nPrefix = 'validate.';
        var t = function (text, prefix) {
            if (prefix === void 0) { prefix = i18nPrefix; }
            return editor.i18next.t(prefix + text);
        };
        // 判断用户是否自定义插入视频
        if (!config.customInsertVideo) {
            if (util_2.UA.isFirefox) {
                editor.cmd.do('insertHTML', "<p data-we-video-p=\"true\"><video src=\"" + url + "\" controls=\"controls\" style=\"max-width:100%\"></video></p><p>&#8203</p>");
            }
            else {
                editor.cmd.do('insertHTML', "<video src=\"" + url + "\" controls=\"controls\" style=\"max-width:100%\"></video>" + const_1.EMPTY_P);
            }
        }
        else {
            config.customInsertVideo(url);
            return;
        }
        // 加载视频
        var video = document.createElement('video');
        video.onload = function () {
            video = null;
        };
        video.onerror = function () {
            config.customAlert(t('插入视频错误'), 'error', "wangEditor: " + t('插入视频错误') + "\uFF0C" + t('视频链接') + " \"" + url + "\"\uFF0C" + t('下载链接失败'));
            video = null;
        };
        video.onabort = function () { return (video = null); };
        video.src = url;
    };
    return UploadVideo;
}());
exports.default = UploadVideo;
//# sourceMappingURL=upload-video.js.map