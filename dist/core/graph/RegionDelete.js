"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DrawingHelper_1 = require("./DrawingHelper");
var Graph_1 = require("../common/Graph");
var DragHelper_1 = require("./DragHelper");
var RegionDelete = /** @class */ (function () {
    function RegionDelete(app, extraLayer, shapeLayer) {
        var _this = this;
        this._hasOpen = false;
        this._startDraw = function (event) {
            _this._startX = event.data.global.x;
            _this._startY = event.data.global.y;
            _this._startDown = true;
            _this._graph = new Graph_1.ShapeGraphics();
            _this._regionLayer.addChild(_this._graph);
        };
        this._drawing = function (event) {
            if (_this._startDown) {
                var conStyle = {
                    backgroundAlpha: 0.15,
                    backgroundColor: 0x4494F0,
                    border: {
                        lineWidth: 1,
                        color: 0x4494F0,
                        lineStyle: Graph_1.LineStyle.Solid
                    },
                    font: {
                        fontSize: 14,
                        fill: [0x000000]
                    },
                    content: "",
                    hasMark: false,
                    alpha: 0.8,
                    interactive: true
                };
                _this._graph.clear();
                var moveX = event.data.global.x;
                var moveY = event.data.global.y;
                var position_1 = _this._app.graphManager.graphContainer.position;
                var scale_1 = _this._app.graphManager.graphContainer.scale;
                var getPoint = function (data, type) {
                    if (type == "x") {
                        return (data - position_1.x) / scale_1.x;
                    }
                    else {
                        return (data - position_1.y) / scale_1.y;
                    }
                };
                var shape = [
                    [getPoint(_this._startX, "x"), getPoint(_this._startY, "y")],
                    [getPoint(_this._startX, "x"), getPoint(moveY, "y")],
                    [getPoint(moveX, "x"), getPoint(moveY, "y")],
                    [getPoint(moveX, "x"), getPoint(_this._startY, "y")]
                ];
                // 没有文字所以textScale可以传1或者任意数字
                DrawingHelper_1.drawShape(_this._graph, shape, 1, conStyle);
            }
        };
        this._endDraw = function (event) {
            if (_this._startDown) {
                _this._startDown = false;
                var deleteArr_1 = [];
                _this._shapeLayer.children.forEach(function (item) {
                    if (item.xMin > _this._graph.xMin && item.xMax < _this._graph.xMax && item.yMin > _this._graph.yMin && item.yMax < _this._graph.yMax) {
                        deleteArr_1.push(item.shapeIndex);
                    }
                });
                if (deleteArr_1.length > 0) {
                    _this._app.actionManager.deleteShape(deleteArr_1);
                }
                _this._regionLayer.removeChild(_this._graph);
                if (_this._callBack) {
                    _this._callBack(deleteArr_1);
                }
            }
        };
        this._app = app;
        this._extraLayer = extraLayer;
        this._shapeLayer = shapeLayer;
        this._regionLayer = new PIXI.Container();
        this._regionLayer.hitArea = new PIXI.Rectangle(-10000000, -10000000, 100000000000000, 100000000000000);
        this._regionLayer.interactive = true;
    }
    RegionDelete.prototype.enable = function (isEnabled, callBack) {
        if (isEnabled) {
            this._callBack = callBack;
            this._hasOpen = true;
            // 关闭所有事件
            this._changeInteractive(false);
            this._unbindEvent();
            this._app.graphManager.graphContainer.addChild(this._regionLayer);
            this._regionLayer.on("pointerdown", this._startDraw)
                .on("mousemove", this._drawing)
                .on("pointerup", this._endDraw)
                .on("pointerout", this._endDraw);
        }
        else {
            if (!this._hasOpen) {
                return;
            }
            else {
                this._hasOpen = false;
            }
            this._changeInteractive(true);
            this._unbindEvent();
            this._app.graphManager.graphContainer.removeChild(this._regionLayer);
        }
    };
    // disable(): void {
    //     this._changeInteractive(true);
    //     this._unbindEvent();
    //     this._app.graphManager.graphContainer.removeChild(this._regionLayer);
    // }
    RegionDelete.prototype._unbindEvent = function () {
        this._regionLayer.off("pointerdown", this._startDraw)
            .off("mousemove", this._drawing)
            .off("pointerup", this._endDraw)
            .off("pointerout", this._endDraw);
    };
    RegionDelete.prototype._changeInteractive = function (state) {
        DragHelper_1.default(this._app.graphManager.graphContainer, state);
        this._app.graphManager.graphContainer.interactive = state;
        this._shapeLayer.interactiveChildren = state;
    };
    return RegionDelete;
}());
exports.default = RegionDelete;
