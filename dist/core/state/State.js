"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EditBorder = {
    lineWidth: 4,
    color: 0x7ed321,
};
var SelectSuperState = /** @class */ (function () {
    function SelectSuperState(index, select) {
        this.isChangingSelect = true;
        this._index = index; // 选中shape的index
        this._select = select; // 选中目标的类型
    }
    SelectSuperState.prototype.processLayer = function (graphManager, eventManager) {
        return;
    };
    ;
    SelectSuperState.prototype.processGraph = function (graphManager, eventManager) {
        // 选中状态时，才会执行该方法，否则该方法将被重写
        graphManager.enableEraser(false); // 清除橡皮擦
        graphManager.enableRegionDelete(false); // 清除框选删除
        this.processLayer(graphManager, eventManager);
    };
    ;
    return SelectSuperState;
}());
exports.SelectSuperState = SelectSuperState;
// 展示、选中
var NomalSelectState = /** @class */ (function (_super) {
    __extends(NomalSelectState, _super);
    function NomalSelectState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NomalSelectState.prototype.processLayer = function (graphManager, eventManager) {
        graphManager.addDisplayLayer(this.isChangingSelect, this._index);
    };
    return NomalSelectState;
}(SelectSuperState));
exports.NomalSelectState = NomalSelectState;
// 编辑、选中
var EditingSelectState = /** @class */ (function (_super) {
    __extends(EditingSelectState, _super);
    function EditingSelectState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditingSelectState.prototype.processLayer = function (graphManager, eventManager) {
        graphManager.addEditLayer(this.isChangingSelect, this._index, this._select);
    };
    return EditingSelectState;
}(SelectSuperState));
exports.EditingSelectState = EditingSelectState;
var EditingEraserState = /** @class */ (function (_super) {
    __extends(EditingEraserState, _super);
    function EditingEraserState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditingEraserState.prototype.processLayer = function (graphManager, eventManager) {
        var enableEraser = true;
        // 开启橡皮擦
        graphManager.enableEraser(enableEraser);
        graphManager.addEditLayer(this.isChangingSelect, this._index, this._select);
    };
    return EditingEraserState;
}(SelectSuperState));
exports.EditingEraserState = EditingEraserState;
// 框选删除
var EditingRegionDeleteState = /** @class */ (function (_super) {
    __extends(EditingRegionDeleteState, _super);
    function EditingRegionDeleteState(index, select, enable, callBack) {
        var _this = _super.call(this, index, select) || this;
        _this._enable = enable; // 框选删除的状态
        _this._callBack = callBack;
        return _this;
    }
    EditingRegionDeleteState.prototype.processGraph = function (graphManager, eventManager) {
        graphManager.removeLayer();
        graphManager.enableRegionDelete(this._enable, this._callBack);
    };
    return EditingRegionDeleteState;
}(SelectSuperState));
exports.EditingRegionDeleteState = EditingRegionDeleteState;
// 展示
var NomalNoneState = /** @class */ (function (_super) {
    __extends(NomalNoneState, _super);
    function NomalNoneState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NomalNoneState.prototype.processGraph = function (graphManager, eventManager) {
        graphManager.removeLayer();
        graphManager.enableRegionDelete(false);
    };
    return NomalNoneState;
}(SelectSuperState));
exports.NomalNoneState = NomalNoneState;
// 编辑
var EditingNoneState = /** @class */ (function (_super) {
    __extends(EditingNoneState, _super);
    function EditingNoneState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditingNoneState.prototype.processGraph = function (graphManager, eventManager) {
        graphManager.removeLayer();
        graphManager.enableRegionDelete(false);
    };
    return EditingNoneState;
}(SelectSuperState));
exports.EditingNoneState = EditingNoneState;
