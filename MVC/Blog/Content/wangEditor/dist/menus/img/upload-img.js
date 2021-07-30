"use strict";
/**
 * @description 上传图片
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../utils/util");
var upload_core_1 = tslib_1.__importDefault(require("../../editor/upload/upload-core"));
var progress_1 = tslib_1.__importDefault(require("../../editor/upload/progress"));
var UploadImg = /** @class */ (function () {
    function UploadImg(editor) {
        this.editor = editor;
    }
    /**
     * 往编辑区域插入图片
     * @param src 图片地址
     */
    UploadImg.prototype.insertImg = function (src, alt, href) {
        var editor = this.editor;
        var config = editor.config;
        var i18nPrefix = 'validate.';
        var t = function (text, prefix) {
            if (prefix === void 0) { prefix = i18nPrefix; }
            return editor.i18next.t(prefix + text);
        };
        // 设置图片alt
        var altText = alt ? "alt=\"" + alt + "\" " : '';
        var hrefText = href ? "data-href=\"" + encodeURIComponent(href) + "\" " : '';
        // 先插入图片，无论是否能成功
        editor.cmd.do('insertHTML', "<img src=\"" + src + "\" " + altText + hrefText + "style=\"max-width:100%;\" contenteditable=\"false\"/>");
        // 执行回调函数
        config.linkImgCallback(src, alt, href);
        // 加载图片
        var img = document.createElement('img');
        img.onload = function () {
            img = null;
        };
        img.onerror = function () {
            config.customAlert(t('插入图片错误'), 'error', "wangEditor: " + t('插入图片错误') + "\uFF0C" + t('图片链接') + " \"" + src + "\"\uFF0C" + t('下载链接失败'));
            img = null;
        };
        img.onabort = function () { return (img = null); };
        img.src = src;
    };
    /**
     * 上传图片
     * @param files 文件列表
     */
    UploadImg.prototype.uploadImg = function (files) {
        var _this_1 = this;
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
        var uploadImgServer = config.uploadImgServer;
        // base64 格式
        var uploadImgShowBase64 = config.uploadImgShowBase64;
        // 图片最大体积
        var maxSize = config.uploadImgMaxSize;
        var maxSizeM = maxSize / 1024 / 1024;
        // 一次最多上传图片数量
        var maxLength = config.uploadImgMaxLength;
        // 自定义 fileName
        var uploadFileName = config.uploadFileName;
        // 自定义参数
        var uploadImgParams = config.uploadImgParams;
        // 参数拼接到 url 中
        var uploadImgParamsWithUrl = config.uploadImgParamsWithUrl;
        // 自定义 header
        var uploadImgHeaders = config.uploadImgHeaders;
        // 钩子函数
        var hooks = config.uploadImgHooks;
        // 上传图片超时时间
        var timeout = config.uploadImgTimeout;
        // 跨域带 cookie
        var withCredentials = config.withCredentials;
        // 自定义上传图片
        var customUploadImg = config.customUploadImg;
        if (!customUploadImg) {
            // 没有 customUploadImg 的情况下，需要如下两个配置才能继续进行图片上传
            if (!uploadImgServer && !uploadImgShowBase64) {
                return;
            }
        }
        // ------------------------------ 验证文件信息 ------------------------------
        var resultFiles = [];
        var errInfos = [];
        util_1.arrForEach(files, function (file) {
            var name = file.name || file.type.replace('/', '.'); // 兼容低版本chrome 没有name
            var size = file.size;
            // chrome 低版本 name === undefined
            if (!name || !size) {
                return;
            }
            // 将uploadImgAccept数组转换为正则对象
            var imgType = editor.config.uploadImgAccept.join('|');
            var imgTypeRuleStr = ".(" + imgType + ")$";
            var uploadImgAcceptRule = new RegExp(imgTypeRuleStr, 'i');
            if (uploadImgAcceptRule.test(name) === false) {
                // 后缀名不合法，不是图片
                errInfos.push("\u3010" + name + "\u3011" + t('不是图片'));
                return;
            }
            if (maxSize < size) {
                // 上传图片过大
                errInfos.push("\u3010" + name + "\u3011" + t('大于') + " " + maxSizeM + "M");
                return;
            }
            // 验证通过的加入结果列表
            resultFiles.push(file);
        });
        // 抛出验证信息
        if (errInfos.length) {
            config.customAlert(t('图片验证未通过') + ": \n" + errInfos.join('\n'), 'warning');
            return;
        }
        // 如果过滤后文件列表为空直接返回
        if (resultFiles.length === 0) {
            config.customAlert(t('传入的文件不合法'), 'warning');
            return;
        }
        if (resultFiles.length > maxLength) {
            config.customAlert(t('一次最多上传') + maxLength + t('张图片'), 'warning');
            return;
        }
        // ------------------------------ 自定义上传 ------------------------------
        if (customUploadImg && typeof customUploadImg === 'function') {
            customUploadImg(resultFiles, this.insertImg.bind(this));
            // 阻止以下代码执行，重要！！！
            return;
        }
        // ------------------------------ 上传图片 ------------------------------
        // 添加图片数据
        var formData = new FormData();
        resultFiles.forEach(function (file, index) {
            var name = uploadFileName || file.name;
            if (resultFiles.length > 1) {
                // 多个文件时，filename 不能重复
                name = name + (index + 1);
            }
            formData.append(name, file);
        });
        if (uploadImgServer) {
            // 添加自定义参数
            var uploadImgServerArr = uploadImgServer.split('#');
            uploadImgServer = uploadImgServerArr[0];
            var uploadImgServerHash = uploadImgServerArr[1] || '';
            util_1.forEach(uploadImgParams, function (key, val) {
                // 因使用者反应，自定义参数不能默认 encode ，由 v3.1.1 版本开始注释掉
                // val = encodeURIComponent(val)
                // 第一，将参数拼接到 url 中
                if (uploadImgParamsWithUrl) {
                    if (uploadImgServer.indexOf('?') > 0) {
                        uploadImgServer += '&';
                    }
                    else {
                        uploadImgServer += '?';
                    }
                    uploadImgServer = uploadImgServer + key + '=' + val;
                }
                // 第二，将参数添加到 formData 中
                formData.append(key, val);
            });
            if (uploadImgServerHash) {
                uploadImgServer += '#' + uploadImgServerHash;
            }
            // 开始上传
            var xhr = upload_core_1.default(uploadImgServer, {
                timeout: timeout,
                formData: formData,
                headers: uploadImgHeaders,
                withCredentials: !!withCredentials,
                beforeSend: function (xhr) {
                    if (hooks.before)
                        return hooks.before(xhr, editor, resultFiles);
                },
                onTimeout: function (xhr) {
                    config.customAlert(t('上传图片超时'), 'error');
                    if (hooks.timeout)
                        hooks.timeout(xhr, editor);
                },
                onProgress: function (percent, e) {
                    var progressBar = new progress_1.default(editor);
                    if (e.lengthComputable) {
                        percent = e.loaded / e.total;
                        progressBar.show(percent);
                    }
                },
                onError: function (xhr) {
                    config.customAlert(t('上传图片错误'), 'error', t('上传图片错误') + "\uFF0C" + t('服务器返回状态') + ": " + xhr.status);
                    if (hooks.error)
                        hooks.error(xhr, editor);
                },
                onFail: function (xhr, resultStr) {
                    config.customAlert(t('上传图片失败'), 'error', t('上传图片返回结果错误') + ("\uFF0C" + t('返回结果') + ": ") + resultStr);
                    if (hooks.fail)
                        hooks.fail(xhr, editor, resultStr);
                },
                onSuccess: function (xhr, result) {
                    if (hooks.customInsert) {
                        // 自定义插入图片
                        hooks.customInsert(_this_1.insertImg.bind(_this_1), result, editor);
                        return;
                    }
                    if (result.errno != '0') {
                        // 返回格式不对，应该为 { errno: 0, data: [...] }
                        config.customAlert(t('上传图片失败'), 'error', t('上传图片返回结果错误') + "\uFF0C" + t('返回结果') + " errno=" + result.errno);
                        if (hooks.fail)
                            hooks.fail(xhr, editor, result);
                        return;
                    }
                    // 成功，插入图片
                    var data = result.data;
                    data.forEach(function (link) {
                        if (typeof link === 'string') {
                            _this_1.insertImg(link);
                        }
                        else {
                            _this_1.insertImg(link.url, link.alt, link.href);
                        }
                    });
                    // 钩子函数
                    if (hooks.success)
                        hooks.success(xhr, editor, result);
                },
            });
            if (typeof xhr === 'string') {
                // 上传被阻止
                config.customAlert(xhr, 'error');
            }
            // 阻止以下代码执行，重要！！！
            return;
        }
        // ------------------------------ 显示 base64 格式 ------------------------------
        if (uploadImgShowBase64) {
            util_1.arrForEach(files, function (file) {
                var _this = _this_1;
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    if (!this.result)
                        return;
                    var imgLink = this.result.toString();
                    _this.insertImg(imgLink, imgLink);
                };
            });
        }
    };
    return UploadImg;
}());
exports.default = UploadImg;
//# sourceMappingURL=upload-img.js.map