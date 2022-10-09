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
var Graph_1 = require("../common/Graph");
var Action_1 = require("./Action");
var Manager = /** @class */ (function () {
    function Manager(app) {
        this._actionIndex = -1;
        this._actionList = [];
        this._app = app;
    }
    Manager.prototype.addAction = function (action) {
        try {
            this._currentData = action.do(this._currentData);
        }
        catch (error) {
            console.log(error);
            return;
        }
        this._actionIndex++;
        this._actionList.splice(this._actionIndex); // delete the orig actions
        this._actionList.push(action);
        //最多保留30条记录
        if (this._actionList.length > 30) {
            this._actionList = this._actionList.slice(-30);
        }
    };
    Manager.prototype.unDo = function (callback) {
        var index = this._actionIndex;
        var list = this._actionList;
        if (index === -1) {
            return;
        }
        var action = list[index];
        this._actionIndex--;
        this._currentData = action.unDo(this._currentData);
        if (callback) {
            callback(action.shapeIndex, action.actionEvent);
        }
        // 取消选中和橡皮擦状态
        this._app.stateManager.enableEraser(false);
        this._app.stateManager.select(Graph_1.SelectEnum.None, []);
    };
    Manager.prototype.reDo = function (callback) {
        var index = this._actionIndex;
        var list = this._actionList;
        if (index === list.length - 1) {
            return;
        }
        var action = list[index + 1];
        this._actionIndex++;
        this._currentData = action.do(this._currentData);
        if (callback) {
            callback(action.shapeIndex, action.actionEvent);
        }
        // 取消选中和橡皮擦状态
        this._app.stateManager.enableEraser(false);
        this._app.stateManager.select(Graph_1.SelectEnum.None, []);
    };
    Manager.prototype.emptyDoingList = function () {
        this._actionList = [];
    };
    return Manager;
}());
var ActionManager = /** @class */ (function (_super) {
    __extends(ActionManager, _super);
    function ActionManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //启用编辑模式时 执行;保存后 是否清空修改记录？？
    ActionManager.prototype.init = function (data) {
        //this._data = data;
        this._currentData = data; //编辑的原始数据
        this._actionIndex = -1; //当前的操作步骤
        this._actionList = []; //?? 记录的应该是 操作类型（添加／删除／修改），shapeIndex和修改前、后的shapedata
    };
    ActionManager.prototype.getCurrentData = function () {
        var order = [];
        var shapeLayer = this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach(function (item) {
            order.push(item.shapeIndex);
        });
        var newGraph = {
            shapes: JSON.parse(JSON.stringify(this._currentData.shapes)),
            order: order
        };
        return newGraph;
    };
    ActionManager.prototype.addShape = function (x, y, width, height) {
        var pointArr;
        pointArr = [[x, y], [x, y + height], [x + width, y + height], [x + width, y]];
        var action = new Action_1.CreateShapeAction(pointArr, this._app);
        this.addAction(action);
    };
    ;
    ActionManager.prototype.copyShape = function (shapeIndex) {
        var action = new Action_1.CopyShapeAction(shapeIndex, this._app);
        this.addAction(action);
        this._app.stateManager.select(Graph_1.SelectEnum.None, []);
    };
    ;
    ActionManager.prototype.deleteShape = function (shapeIndex) {
        // 如果传入的为number 做强转换
        if (Object.prototype.toString.call(shapeIndex) == "[object Number]") {
            shapeIndex = [Number(shapeIndex)];
        }
        var action = new Action_1.DeleteShapeAction(shapeIndex, this._app);
        this.addAction(action);
        this._app.stateManager.select(Graph_1.SelectEnum.None, []);
    };
    ;
    ActionManager.prototype.updateShape = function (shape, shapeIndex) {
        var action = new Action_1.UpdateShapeAction(shape, shapeIndex, this._app);
        this.addAction(action);
    };
    ;
    ActionManager.prototype.getCurrentShape = function (shapeIndex) {
        return JSON.parse(JSON.stringify(this._currentData.shapes[shapeIndex]));
    };
    return ActionManager;
}(Manager));
exports.default = ActionManager;
