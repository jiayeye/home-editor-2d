"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Graph_1 = require("../common/Graph");
var OperationHelper_1 = require("./OperationHelper");
var OperationManager = /** @class */ (function () {
    function OperationManager(app) {
        this._app = app;
        this._graphCon = this._app.graphManager.graphContainer;
    }
    OperationManager.prototype.zoomIn = function (level) {
        if (level === void 0) { level = 1.25; }
        this._graphCon.x -= this._graphCon.width * (level - 1) / 2;
        this._graphCon.y -= this._graphCon.height * (level - 1) / 2;
        this._graphCon.scale.x *= level;
        this._graphCon.scale.y *= level;
        OperationHelper_1.changeTextStyle(this._graphCon.scale.y, this._graphCon);
    };
    OperationManager.prototype.zoomOut = function (level) {
        if (level === void 0) { level = 1.25; }
        this._graphCon.x += this._graphCon.width * (1 - 1 / level) / 2;
        this._graphCon.y += this._graphCon.height * (1 - 1 / level) / 2;
        this._graphCon.scale.x /= level;
        this._graphCon.scale.y /= level;
        OperationHelper_1.changeTextStyle(this._graphCon.scale.y, this._graphCon);
    };
    OperationManager.prototype.justify = function () {
        //如果shapelayer里面没有children 不做居中
        var shapeLayer = this._graphCon.getChildByName("shapeLayer");
        var appScreen = this._app.pixiApp.screen;
        var backgroundLayer = this._graphCon.getChildByName("backgroundLayer");
        if (shapeLayer.children.length < 1 && backgroundLayer.width <= 1) {
            return;
        }
        if (backgroundLayer.width > 1) {
            //设置graph的长宽
            if ((this._graphCon.width / this._graphCon.height) > (appScreen.width / appScreen.height)) {
                //以width为准
                this._graphCon.height = this._graphCon.height / (this._graphCon.width / appScreen.width);
                this._graphCon.width = appScreen.width;
            }
            else {
                //以height为准
                this._graphCon.width = this._graphCon.width / (this._graphCon.height / appScreen.height);
                this._graphCon.height = appScreen.height;
            }
            //设置graph的定位
            this._graphCon.x = appScreen.width / 2 - this._graphCon.width / 2;
            this._graphCon.y = appScreen.height / 2 - this._graphCon.height / 2;
        }
        else {
            var multiple = 0; // 缩放倍数
            var scaleShapeWidth = this._graphCon.scale.x * shapeLayer.width; // 计算shapelayer的长宽
            var scaleShapeHeight = this._graphCon.scale.y * shapeLayer.height;
            var standard = '';
            //设置graph的长宽
            if ((scaleShapeWidth / scaleShapeHeight) > (appScreen.width / appScreen.height)) {
                //以width为准
                multiple = appScreen.width / scaleShapeWidth;
                standard = 'width';
            }
            else {
                //以height为准
                multiple = appScreen.height / scaleShapeHeight;
                standard = 'height';
            }
            this._graphCon.width = this._graphCon.width * multiple;
            this._graphCon.height = this._graphCon.height * multiple;
            scaleShapeWidth = scaleShapeWidth * multiple;
            scaleShapeHeight = scaleShapeHeight * multiple;
            //设置graph的定位
            var x = void 0, y = void 0;
            if (standard == 'width') {
                x = -(this._graphCon.width - scaleShapeWidth);
                y = appScreen.height / 2 - scaleShapeHeight / 2;
            }
            else {
                x = -(this._graphCon.width - scaleShapeWidth / 2 - appScreen.width / 2);
                y = -(this._graphCon.height - scaleShapeHeight);
            }
            this._graphCon.x = x;
            this._graphCon.y = y;
        }
        OperationHelper_1.changeTextStyle(this._graphCon.scale.y, this._graphCon);
    };
    OperationManager.prototype.setEraserSize = function (size) {
        this._app.graphManager.setEraserSize(size);
    };
    OperationManager.prototype.enableEraser = function (isEnabled) {
        this._app.stateManager.enableEraser(isEnabled);
    };
    OperationManager.prototype.enableEdit = function (isEnabled) {
        this._app.stateManager.enableEdit(isEnabled);
    };
    OperationManager.prototype.setShapeContent = function (index, content) {
        this._app.graphManager.setShapeContent(index, content);
    };
    OperationManager.prototype.addShadowShape = function (width, height, content) {
        this._app.graphManager.setShadowShape(width, height, content);
    };
    OperationManager.prototype.deleteShadowShape = function () {
        this._app.graphManager.deleteShadowShape();
    };
    OperationManager.prototype.addPoint = function (lineIndex) {
        this._app.graphManager.addPoint(lineIndex);
    };
    OperationManager.prototype.selectNone = function () {
        this._app.stateManager.select(Graph_1.SelectEnum.None, []);
    };
    OperationManager.prototype.enableRegionDelete = function (isEnabled, callBack) {
        this._app.stateManager.enableRegionDelete(isEnabled, callBack);
    };
    return OperationManager;
}());
exports.default = OperationManager;
