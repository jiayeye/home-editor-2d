"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StateFactory_1 = require("./StateFactory");
var Graph_1 = require("../common/Graph");
var State_1 = require("./State");
// app状态管理
var StateManager = /** @class */ (function () {
    function StateManager(app) {
        this._app = app;
        this._editEnum = Graph_1.EditEnum.Nomal;
        this._selectEnum = Graph_1.SelectEnum.None;
        this._isEnableEraser = false;
        this._selectIndex = [];
        this._currentState = StateFactory_1.default(this._editEnum, this._selectEnum, this._isEnableEraser, this._selectIndex);
    }
    StateManager.prototype._activeState = function (isChange) {
        if (isChange === void 0) { isChange = true; }
        var graphManager = this._app.graphManager;
        var eventManager = this._app.eventManager;
        this._currentState = StateFactory_1.default(this._editEnum, this._selectEnum, this._isEnableEraser, this._selectIndex);
        this._currentState.isChangingSelect = isChange;
        this._currentState.processGraph(graphManager, eventManager);
    };
    StateManager.prototype.enableEdit = function (isEnabled) {
        this._editEnum = isEnabled ? Graph_1.EditEnum.Editing : Graph_1.EditEnum.Nomal;
        this._selectEnum = Graph_1.SelectEnum.None;
        this._isEnableEraser = false;
        this._selectIndex = [];
        this._isEnableRegionDelete = false;
        this._activeState();
        this._app.eventManager.setEditState(this._editEnum);
    };
    StateManager.prototype.enableEraser = function (isEnabled) {
        if (this._selectIndex.length == 0) {
            // 只有在选中状态时，才能进橡皮擦模式
            return;
        }
        this._isEnableEraser = isEnabled;
        this._selectEnum = Graph_1.SelectEnum.Shape;
        this._activeState(false);
    };
    StateManager.prototype.select = function (state, index) {
        if (this._selectEnum === Graph_1.SelectEnum.None && state === Graph_1.SelectEnum.None) {
            // 排除了，一直在空点的情况
            return;
        }
        this._selectEnum = state;
        // const isEqual = this._selectIndex.length == index.length &&
        //     this._selectIndex.every((v, i) => v === index[i]);
        var isEqual = this._selectIndex[0] === index[0]; // 只需要判断shapeIndex
        this._selectIndex = index;
        this._activeState(!isEqual);
    };
    StateManager.prototype.enableRegionDelete = function (isEnabled, callBack) {
        if (this._editEnum === Graph_1.EditEnum.Nomal) {
            // 排除了，非编辑状态
            return;
        }
        this._selectEnum = Graph_1.SelectEnum.None;
        this._isEnableEraser = false;
        this._selectIndex = [];
        this._isEnableRegionDelete = isEnabled;
        var graphManager = this._app.graphManager;
        var eventManager = this._app.eventManager;
        this._currentState = new State_1.EditingRegionDeleteState(this._selectIndex, this._selectEnum, isEnabled, callBack);
        this._currentState.processGraph(graphManager, eventManager);
    };
    return StateManager;
}());
exports.default = StateManager;
