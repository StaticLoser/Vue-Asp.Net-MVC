"use strict";
/**
 * @description 创建tabel
 * @author lichunlin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var const_1 = require("../../utils/const");
var dom_core_1 = tslib_1.__importDefault(require("../../utils/dom-core"));
var CreateTable = /** @class */ (function () {
    function CreateTable(editor) {
        this.editor = editor;
    }
    /**
     * 执行创建
     * @param rowValue 行数
     * @param colValue 列数
     */
    CreateTable.prototype.createAction = function (rowValue, colValue) {
        var editor = this.editor;
        //不允许在有序列表中添加table
        var $selectionElem = dom_core_1.default(editor.selection.getSelectionContainerElem());
        var $ul = dom_core_1.default($selectionElem.elems[0]).parentUntilEditor('UL', editor);
        var $ol = dom_core_1.default($selectionElem.elems[0]).parentUntilEditor('OL', editor);
        if ($ul || $ol) {
            return;
        }
        var tableDom = this.createTableHtml(rowValue, colValue);
        editor.cmd.do('insertHTML', tableDom);
    };
    /**
     * 创建table、行、列
     * @param rowValue 行数
     * @param colValue 列数
     */
    CreateTable.prototype.createTableHtml = function (rowValue, colValue) {
        var rowStr = '';
        var colStr = '';
        for (var i = 0; i < rowValue; i++) {
            colStr = '';
            for (var j = 0; j < colValue; j++) {
                if (i === 0) {
                    colStr = colStr + '<th></th>';
                }
                else {
                    colStr = colStr + '<td></td>';
                }
            }
            rowStr = rowStr + '<tr>' + colStr + '</tr>';
        }
        var tableDom = "<table border=\"0\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\"><tbody>" +
            rowStr +
            ("</tbody></table>" + const_1.EMPTY_P);
        return tableDom;
    };
    return CreateTable;
}());
exports.default = CreateTable;
//# sourceMappingURL=create-table.js.map