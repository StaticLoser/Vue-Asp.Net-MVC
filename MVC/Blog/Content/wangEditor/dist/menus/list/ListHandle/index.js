"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createListHandle = exports.ClassType = void 0;
var tslib_1 = require("tslib");
var dom_core_1 = tslib_1.__importDefault(require("../../../utils/dom-core"));
var WrapListHandle_1 = tslib_1.__importDefault(require("./WrapListHandle"));
var JoinListHandle_1 = tslib_1.__importDefault(require("./JoinListHandle"));
var StartJoinListHandle_1 = tslib_1.__importDefault(require("./StartJoinListHandle"));
var EndJoinListHandle_1 = tslib_1.__importDefault(require("./EndJoinListHandle"));
var OtherListHandle_1 = tslib_1.__importDefault(require("./OtherListHandle"));
var ClassType;
(function (ClassType) {
    ClassType["Wrap"] = "WrapListHandle";
    ClassType["Join"] = "JoinListHandle";
    ClassType["StartJoin"] = "StartJoinListHandle";
    ClassType["EndJoin"] = "EndJoinListHandle";
    ClassType["Other"] = "OtherListHandle";
})(ClassType = exports.ClassType || (exports.ClassType = {}));
var handle = {
    WrapListHandle: WrapListHandle_1.default,
    JoinListHandle: JoinListHandle_1.default,
    StartJoinListHandle: StartJoinListHandle_1.default,
    EndJoinListHandle: EndJoinListHandle_1.default,
    OtherListHandle: OtherListHandle_1.default,
};
function createListHandle(classType, options, range) {
    if (classType === ClassType.Other && range === undefined) {
        throw new Error('other 类需要传入 range');
    }
    return classType !== ClassType.Other
        ? new handle[classType](options)
        : new handle[classType](options, range);
}
exports.createListHandle = createListHandle;
/**
 * 统一执行的接口
 */
var ListHandleCommand = /** @class */ (function () {
    function ListHandleCommand(handle) {
        this.handle = handle;
        this.handle.exec();
    }
    ListHandleCommand.prototype.getSelectionRangeElem = function () {
        return dom_core_1.default(this.handle.selectionRangeElem.get());
    };
    return ListHandleCommand;
}());
exports.default = ListHandleCommand;
//# sourceMappingURL=index.js.map