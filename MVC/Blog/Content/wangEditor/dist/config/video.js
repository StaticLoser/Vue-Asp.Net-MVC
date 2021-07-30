"use strict";
/**
 * @description 视频相关的配置
 * @author hutianhao
 */
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("../utils/const");
exports.default = {
    // 插入网络视频前的回调函数
    onlineVideoCheck: function (video) {
        return true;
    },
    // 插入网络视频成功之后的回调函数
    onlineVideoCallback: const_1.EMPTY_FN,
    // 显示“插入视频”
    showLinkVideo: true,
    // accept
    uploadVideoAccept: ['mp4'],
    // 服务端地址
    uploadVideoServer: '',
    // 上传视频的最大体积，默认 1024M
    uploadVideoMaxSize: 1 * 1024 * 1024 * 1024,
    // 一次最多上传多少个视频
    // uploadVideoMaxLength: 2,
    // 自定义上传视频的名称
    uploadVideoName: '',
    // 上传视频自定义参数
    uploadVideoParams: {},
    // 自定义参数拼接到 url 中
    uploadVideoParamsWithUrl: false,
    // 上传视频自定义 header
    uploadVideoHeaders: {},
    // 钩子函数
    uploadVideoHooks: {},
    // 上传视频超时时间 ms 默认2个小时
    uploadVideoTimeout: 1000 * 60 * 60 * 2,
    // 跨域带 cookie
    withVideoCredentials: false,
    // 自定义上传
    customUploadVideo: null,
    // 自定义插入视频
    customInsertVideo: null,
};
//# sourceMappingURL=video.js.map