"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPlugin = void 0;
var tslib_1 = require("tslib");
var editor_1 = tslib_1.__importDefault(require("../editor"));
var util_1 = require("../utils/util");
/**
 * 插件注册
 * @param { string } name 插件名
 * @param { RegisterOptions } options 插件配置
 * @param { pluginsListType } memory 存储介质
 */
function registerPlugin(name, options, memory) {
    if (!name) {
        throw new TypeError('name is not define');
    }
    if (!options) {
        throw new TypeError('options is not define');
    }
    if (!options.intention) {
        throw new TypeError('options.intention is not define');
    }
    if (options.intention && typeof options.intention !== 'function') {
        throw new TypeError('options.intention is not function');
    }
    if (memory[name]) {
        console.warn("plugin " + name + " \u5DF2\u5B58\u5728\uFF0C\u5DF2\u8986\u76D6\u3002");
    }
    memory[name] = options;
}
exports.registerPlugin = registerPlugin;
/**
 * 插件初始化
 * @param { Editor } editor 编辑器实例
 */
function initPlugins(editor) {
    var plugins = Object.assign({}, util_1.deepClone(editor_1.default.globalPluginsFunctionList), util_1.deepClone(editor.pluginsFunctionList));
    var values = Object.entries(plugins);
    values.forEach(function (_a) {
        var name = _a[0], options = _a[1];
        console.info("plugin " + name + " initializing");
        var intention = options.intention, config = options.config;
        intention(editor, config);
        console.info("plugin " + name + " initialization complete");
    });
}
exports.default = initPlugins;
//# sourceMappingURL=index.js.map