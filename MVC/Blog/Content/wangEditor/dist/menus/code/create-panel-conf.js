"use strict";
/**
 * @description code 菜单 panel tab 配置
 * @author lkw
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var util_1 = require("../../utils/util");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var is_active_1 = tslib_1.__importDefault(require("./is-active"));
var const_1 = require("../../utils/const");
function default_1(editor, text, languageType) {
    // panel 中需要用到的id
    var inputIFrameId = util_1.getRandom('input-iframe');
    var languageId = util_1.getRandom('select');
    var btnOkId = util_1.getRandom('btn-ok');
    /**
     * 插入链接
     * @param text 文字
     * @param code 链接
     */
    function insertCode(text) {
        var _a;
        // 选区处于链接中，则选中整个菜单，再执行 insertHTML
        var active = is_active_1.default(editor);
        if (active) {
            selectCodeElem();
        }
        var content = (_a = editor.selection.getSelectionStartElem()) === null || _a === void 0 ? void 0 : _a.elems[0].innerHTML;
        if (content) {
            editor.cmd.do('insertHTML', const_1.EMPTY_P);
        }
        editor.cmd.do('insertHTML', text);
        var $code = editor.selection.getSelectionStartElem();
        var $codeElem = $code === null || $code === void 0 ? void 0 : $code.getNodeTop(editor);
        // 通过dom操作添加换行标签
        // @ts-ignore
        dom_core_1.default(const_1.EMPTY_P).insertAfter($codeElem);
    }
    /**
     * 选中整个链接元素
     */
    function selectCodeElem() {
        if (!is_active_1.default(editor))
            return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var $selectedCode;
        var $code = editor.selection.getSelectionStartElem();
        var $codeElem = $code === null || $code === void 0 ? void 0 : $code.getNodeTop(editor);
        if (!$codeElem)
            return;
        editor.selection.createRangeByElem($codeElem);
        editor.selection.restoreSelection();
        $selectedCode = $codeElem; // 赋值给函数内全局变量
    }
    var t = function (text) {
        return editor.i18next.t(text);
    };
    // @ts-ignore
    var conf = {
        width: 500,
        height: 0,
        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: t('menus.panelMenus.code.插入代码'),
                // 模板
                tpl: "<div>\n                        <select name=\"\" id=\"" + languageId + "\">\n                            " + editor.config.languageType.map(function (language) {
                    return ('<option ' +
                        (languageType == language ? 'selected' : '') +
                        ' value ="' +
                        language +
                        '">' +
                        language +
                        '</option>');
                }) + "\n                        </select>\n                        <textarea id=\"" + inputIFrameId + "\" type=\"text\" class=\"wang-code-textarea\" placeholder=\"\" style=\"height: 160px\">" + text.replace(/&quot;/g, '"') + "</textarea>\n                        <div class=\"w-e-button-container\">\n                            <button type=\"button\" id=\"" + btnOkId + "\" class=\"right\">" + (is_active_1.default(editor) ? t('修改') : t('插入')) + "</button>\n                        </div>\n                    </div>",
                // 事件绑定
                events: [
                    // 插入链接
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: function () {
                            var formatCode, codeDom;
                            var $code = document.getElementById(inputIFrameId);
                            var $select = dom_core_1.default('#' + languageId);
                            var languageType = $select.val();
                            // @ts-ignore
                            var code = $code.value;
                            // 高亮渲染
                            if (editor.highlight) {
                                formatCode = editor.highlight.highlightAuto(code).value;
                            }
                            else {
                                formatCode = "<xmp>" + code + "</xmp>";
                            }
                            // 代码为空，则不插入
                            if (!code)
                                return;
                            //增加标签
                            if (is_active_1.default(editor)) {
                                return false;
                            }
                            else {
                                //增加pre标签
                                codeDom = "<pre><code class=\"" + languageType + "\">" + formatCode + "</code></pre>";
                                // @ts-ignore
                                insertCode(codeDom);
                            }
                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true;
                        },
                    },
                ],
            },
        ],
    };
    return conf;
}
exports.default = default_1;
//# sourceMappingURL=create-panel-conf.js.map