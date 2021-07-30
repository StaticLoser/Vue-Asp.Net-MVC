"use strict";
/**
 * @description 所有菜单的构造函数
 * @author wangfupeng
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var index_1 = tslib_1.__importDefault(require("./bold/index"));
var index_2 = tslib_1.__importDefault(require("./head/index"));
var index_3 = tslib_1.__importDefault(require("./link/index"));
var index_4 = tslib_1.__importDefault(require("./italic/index"));
var index_5 = tslib_1.__importDefault(require("./underline/index"));
var index_6 = tslib_1.__importDefault(require("./strike-through/index"));
var index_7 = tslib_1.__importDefault(require("./font-style/index"));
var font_size_1 = tslib_1.__importDefault(require("./font-size"));
var index_8 = tslib_1.__importDefault(require("./justify/index"));
var index_9 = tslib_1.__importDefault(require("./quote/index"));
var index_10 = tslib_1.__importDefault(require("./back-color/index"));
var index_11 = tslib_1.__importDefault(require("./font-color/index"));
var index_12 = tslib_1.__importDefault(require("./video/index"));
var index_13 = tslib_1.__importDefault(require("./img/index"));
var index_14 = tslib_1.__importDefault(require("./indent/index"));
var index_15 = tslib_1.__importDefault(require("./emoticon/index"));
var index_16 = tslib_1.__importDefault(require("./list/index"));
var index_17 = tslib_1.__importDefault(require("./lineHeight/index"));
var index_18 = tslib_1.__importDefault(require("./undo/index"));
var index_19 = tslib_1.__importDefault(require("./redo/index"));
var index_20 = tslib_1.__importDefault(require("./table/index"));
var code_1 = tslib_1.__importDefault(require("./code"));
var index_21 = tslib_1.__importDefault(require("./split-line/index"));
var todo_1 = tslib_1.__importDefault(require("./todo"));
exports.default = {
    bold: index_1.default,
    head: index_2.default,
    italic: index_4.default,
    link: index_3.default,
    underline: index_5.default,
    strikeThrough: index_6.default,
    fontName: index_7.default,
    fontSize: font_size_1.default,
    justify: index_8.default,
    quote: index_9.default,
    backColor: index_10.default,
    foreColor: index_11.default,
    video: index_12.default,
    image: index_13.default,
    indent: index_14.default,
    emoticon: index_15.default,
    list: index_16.default,
    lineHeight: index_17.default,
    undo: index_18.default,
    redo: index_19.default,
    table: index_20.default,
    code: code_1.default,
    splitLine: index_21.default,
    todo: todo_1.default,
};
//# sourceMappingURL=menu-list.js.map