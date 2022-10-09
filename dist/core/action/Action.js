"use strict";
/*
 * @Author: xujiawen
 * @Description: 实现撤销重做
 * @Date: 2018-04-26 10:53:51
 * @Last Modified by: xujiawen
 * @Last Modified time: 2018-04-26 10:54:31
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Graph_1 = require("../common/Graph");
var ActionAPI_1 = require("./ActionAPI");
var CreateShapeAction = /** @class */ (function () {
    function CreateShapeAction(pointArr, app) {
        this.shapeIndex = []; // addShapeIndex
        this._pointArr = pointArr;
        this._app = app;
    }
    CreateShapeAction.prototype.do = function (data) {
        this.shapeIndex[0] = data.shapes.length;
        this.actionEvent = ActionAPI_1.ActionEvent.Add;
        var shape = this._app.graphManager.buildShapes(this._pointArr, data.shapes.length);
        this._app.eventManager.bindHandler(Graph_1.SelectEnum.Shape, shape);
        data.shapes.push(this._pointArr);
        return data;
    };
    ;
    CreateShapeAction.prototype.unDo = function (data) {
        this.actionEvent = ActionAPI_1.ActionEvent.Delete;
        this._app.graphManager.deleteShapes(this.shapeIndex[0].toString());
        data.shapes[this.shapeIndex[0]] = []; // 不能删除该元素，要和content一一对应
        return data;
    };
    ;
    return CreateShapeAction;
}());
exports.CreateShapeAction = CreateShapeAction;
var DeleteShapeAction = /** @class */ (function () {
    function DeleteShapeAction(shapeIndex, app) {
        this.shapeIndex = []; //deleteShapeIndex
        this.shapeIndex = shapeIndex;
        this._app = app;
    }
    DeleteShapeAction.prototype.do = function (data) {
        var _this = this;
        this.actionEvent = ActionAPI_1.ActionEvent.Delete;
        this._pointArr = [];
        this.shapeIndex.forEach(function (item) {
            _this._app.graphManager.deleteShapes(item.toString());
            //将对应的点阵置空 保留占位
            _this._pointArr.push(data.shapes[item]);
            data.shapes[item] = [];
        });
        return data;
    };
    ;
    DeleteShapeAction.prototype.unDo = function (data) {
        var _this = this;
        this.shapeIndex = [];
        this._pointArr.forEach(function (item) {
            _this.shapeIndex.push(data.shapes.length);
            var shape = _this._app.graphManager.buildShapes(item, data.shapes.length);
            _this._app.eventManager.bindHandler(Graph_1.SelectEnum.Shape, shape);
            data.shapes.push(item);
        });
        this.actionEvent = ActionAPI_1.ActionEvent.Add;
        //回滚的时 不会滚匹配状态
        return data;
    };
    ;
    return DeleteShapeAction;
}());
exports.DeleteShapeAction = DeleteShapeAction;
var CopyShapeAction = /** @class */ (function () {
    function CopyShapeAction(shapeIndex, app) {
        this.shapeIndex = []; // addShapeIndex
        this._copyShapeIndex = shapeIndex;
        this._app = app;
    }
    CopyShapeAction.prototype.do = function (data) {
        var pointArr = data.shapes[this._copyShapeIndex];
        var newPointArr;
        //拷贝图片添加偏移量：x+20,y+20
        newPointArr = pointArr.map(function (item) {
            var newItem;
            newItem = [item[0] + 20, item[1] + 20];
            return newItem;
        });
        this.shapeIndex[0] = data.shapes.length;
        this.actionEvent = ActionAPI_1.ActionEvent.Add;
        var shape = this._app.graphManager.buildShapes(newPointArr, this.shapeIndex[0]);
        this._app.eventManager.bindHandler(Graph_1.SelectEnum.Shape, shape);
        data.shapes.push(newPointArr);
        return data;
    };
    ;
    CopyShapeAction.prototype.unDo = function (data) {
        this.actionEvent = ActionAPI_1.ActionEvent.Delete;
        this._app.graphManager.deleteShapes(this.shapeIndex.toString());
        data.shapes[this.shapeIndex[0]] = [];
        return data;
    };
    ;
    return CopyShapeAction;
}());
exports.CopyShapeAction = CopyShapeAction;
//编辑时（点的增删改） 更新shape
var UpdateShapeAction = /** @class */ (function () {
    function UpdateShapeAction(shape, shapeIndex, app) {
        this.shapeIndex = []; // updateIndex
        this.actionEvent = ActionAPI_1.ActionEvent.Update;
        this._newShape = shape;
        this.shapeIndex[0] = shapeIndex;
        this._app = app;
    }
    UpdateShapeAction.prototype.do = function (data) {
        this._app.graphManager.updateShapes(this._newShape, this.shapeIndex[0]);
        this._oldShape = data.shapes[this.shapeIndex[0]]; //保存一份修改前的数据
        data.shapes[this.shapeIndex[0]] = this._newShape;
        return data;
    };
    UpdateShapeAction.prototype.unDo = function (data) {
        this._app.graphManager.updateShapes(this._oldShape, this.shapeIndex[0]);
        data.shapes[this.shapeIndex[0]] = this._oldShape;
        return data;
    };
    return UpdateShapeAction;
}());
exports.UpdateShapeAction = UpdateShapeAction;
