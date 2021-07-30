"use strict";
/**
 * @description 无序列表/有序列表
 * @author tonghan
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListType = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var DropListMenu_1 = tslib_1.__importDefault(require("../menu-constructors/DropListMenu"));
var utils_1 = require("./utils");
var ListHandle_1 = tslib_1.__importStar(require("./ListHandle"));
/**
 * 列表的种类
 */
var ListType;
(function (ListType) {
    ListType["OrderedList"] = "OL";
    ListType["UnorderedList"] = "UL";
})(ListType = exports.ListType || (exports.ListType = {}));
var List = /** @class */ (function (_super) {
    tslib_1.__extends(List, _super);
    function List(editor) {
        var _this = this;
        var $elem = dom_core_1.default("<div class=\"w-e-menu\" data-title=\"\u5E8F\u5217\">\n                <i class=\"w-e-icon-list2\"></i>\n            </div>");
        var dropListConf = {
            width: 130,
            title: '序列',
            type: 'list',
            list: [
                {
                    $elem: dom_core_1.default("\n                        <p>\n                            <i class=\"w-e-icon-list2 w-e-drop-list-item\"></i>\n                            " + editor.i18next.t('menus.dropListMenu.list.无序列表') + "\n                        <p>"),
                    value: ListType.UnorderedList,
                },
                {
                    $elem: dom_core_1.default("<p>\n                            <i class=\"w-e-icon-list-numbered w-e-drop-list-item\"></i>\n                            " + editor.i18next.t('menus.dropListMenu.list.有序列表') + "\n                        <p>"),
                    value: ListType.OrderedList,
                },
            ],
            clickHandler: function (value) {
                // 注意 this 是指向当前的 List 对象
                _this.command(value);
            },
        };
        _this = _super.call(this, $elem, editor, dropListConf) || this;
        return _this;
    }
    List.prototype.command = function (type) {
        var editor = this.editor;
        var $selectionElem = editor.selection.getSelectionContainerElem();
        // 选区范围的 DOM 元素不存在，不执行命令
        if ($selectionElem === undefined)
            return;
        // 获取选区范围内的顶级 DOM 元素
        this.handleSelectionRangeNodes(type);
        // 是否激活
        this.tryChangeActive();
    };
    List.prototype.validator = function ($startElem, $endElem, $textElem) {
        if (!$startElem.length ||
            !$endElem.length ||
            $textElem.equal($startElem) ||
            $textElem.equal($endElem)) {
            return false;
        }
        return true;
    };
    List.prototype.handleSelectionRangeNodes = function (listType) {
        var editor = this.editor;
        var selection = editor.selection;
        // 获取 序列标签
        var listTarget = listType.toLowerCase();
        // 获取相对应的 元属节点
        var $selectionElem = selection.getSelectionContainerElem();
        var $startElem = selection.getSelectionStartElem().getNodeTop(editor);
        var $endElem = selection.getSelectionEndElem().getNodeTop(editor);
        // 验证是否执行 处理逻辑
        if (!this.validator($startElem, $endElem, editor.$textElem)) {
            return;
        }
        // 获取选区
        var _range = selection.getRange();
        var _collapsed = _range === null || _range === void 0 ? void 0 : _range.collapsed;
        // 防止光标的时候判断异常
        if (!editor.$textElem.equal($selectionElem)) {
            $selectionElem = $selectionElem.getNodeTop(editor);
        }
        var options = {
            editor: editor,
            listType: listType,
            listTarget: listTarget,
            $selectionElem: $selectionElem,
            $startElem: $startElem,
            $endElem: $endElem,
        };
        var classType;
        // =====================================
        // 当 selectionElem 属于序列元素的时候
        // 代表着当前选区一定是在一个序列元素内的
        // =====================================
        if (this.isOrderElem($selectionElem)) {
            classType = ListHandle_1.ClassType.Wrap;
        }
        // =====================================
        // 当 startElem 和 endElem 属于序列元素的时候
        // 代表着当前选区一定是在再两个序列的中间(包括两个序列)
        // =====================================
        else if (this.isOrderElem($startElem) &&
            this.isOrderElem($endElem)) {
            classType = ListHandle_1.ClassType.Join;
        }
        // =====================================
        // 选区开始元素为 序列 的时候
        // =====================================
        else if (this.isOrderElem($startElem)) {
            classType = ListHandle_1.ClassType.StartJoin;
        }
        // =====================================
        // 选区结束元素为 序列 的时候
        // =====================================
        else if (this.isOrderElem($endElem)) {
            classType = ListHandle_1.ClassType.EndJoin;
        }
        // =====================================
        // 当选区不是序列内且开头和结尾不是序列的时候
        // 直接获取所有顶级段落然后过滤
        // 代表着 设置序列 的操作
        // =====================================
        else {
            classType = ListHandle_1.ClassType.Other;
        }
        var listHandleCmd = new ListHandle_1.default(ListHandle_1.createListHandle(classType, options, _range));
        // 更新选区
        utils_1.updateRange(editor, listHandleCmd.getSelectionRangeElem(), !!_collapsed);
    };
    /**
     * 是否是序列元素节点 UL and OL
     * @param $node
     */
    List.prototype.isOrderElem = function ($node) {
        var nodeName = $node.getNodeName();
        if (nodeName === ListType.OrderedList || nodeName === ListType.UnorderedList) {
            return true;
        }
        return false;
    };
    List.prototype.tryChangeActive = function () { };
    return List;
}(DropListMenu_1.default));
exports.default = List;
//# sourceMappingURL=index.js.map