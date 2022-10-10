"use strict";
/*
 * @Description: 编辑层
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Graph_1 = require("../common/Graph");
var DrawingHelper_1 = require("./DrawingHelper");
var DragHelper_1 = require("./DragHelper");
var constant_1 = require("./constant");
var EditTool = /** @class */ (function () {
    function EditTool(container) {
        this._container = container;
        this._buildLayer();
    }
    EditTool.prototype._buildLayer = function () {
        this._backShape = new Graph_1.ShapeGraphics();
        this._pointLayer = new PIXI.Container();
        this._pointLayer.name = "pointLayer";
        this._lineLayer = new PIXI.Container();
        this._lineLayer.name = "lineLayer";
        this._layer = new PIXI.Container();
        this._layer.addChild(this._backShape);
        this._layer.addChild(this._lineLayer);
        this._layer.addChild(this._pointLayer);
        this._layer.name = "editLayer";
        this._container.addChild(this._layer);
    };
    EditTool.prototype.erasePoints = function () {
        var _this = this;
        return function (points) {
            var newShape = _this._shape;
            points.forEach(function (item) {
                newShape[item] = null;
            });
            newShape = newShape.filter(function (n) { return n !== null; });
            _this.init(newShape, _this._content);
            _this.select(Graph_1.SelectEnum.Shape);
            _this._updateHandler(newShape);
        };
    };
    EditTool.prototype.init = function (shape, content, isDisplay) {
        this.destroy();
        this._shape = shape;
        this._content = content ? content : JSON.parse(JSON.stringify(constant_1.defultGraphStyle));
        this._content.backgroundAlpha = 1;
        if (isDisplay) {
            this._drawBackShape(true);
        }
        else {
            this._drawEditLayer(true, false);
        }
    };
    EditTool.prototype._drawPoint = function (index, isInit, isHighlight) {
        var element = this._shape[index];
        var point;
        if (isInit) {
            point = new Graph_1.PointGraphics();
            point.pointIndex = index;
            point.name = "point_" + index;
            this._pointLayer.addChild(point);
            point.interactive = true;
            this._selectHandler(point, Graph_1.SelectEnum.Point, index);
            DragHelper_1.default(point);
        }
        else {
            point = this._pointLayer.getChildByName("point_" + index);
            point.clear();
        }
        if (typeof isHighlight === 'boolean') {
            point.isHighlight = isHighlight;
        }
        else {
            point.isHighlight = isHighlight.select === Graph_1.SelectEnum.Point
                && isHighlight.index === point.pointIndex;
        }
        DrawingHelper_1.buildPoint(point, element);
    };
    EditTool.prototype._drawLine = function (index, isInit, isHighlight) {
        var startPoint = this._shape[index];
        var endPoint = (index == this._shape.length - 1) ?
            this._shape[0] : this._shape[index + 1];
        var line;
        if (isInit) {
            line = new Graph_1.LineGraphics();
            line.lineIndex = index;
            line.name = "line_" + index;
            this._lineLayer.addChild(line);
            line.interactive = true;
            this._selectHandler(line, Graph_1.SelectEnum.Line, index);
            DragHelper_1.default(line);
        }
        else {
            line = this._lineLayer.getChildByName("line_" + index);
            line.clear();
        }
        if (typeof isHighlight === 'boolean') {
            line.isHighlight = isHighlight;
        }
        else {
            line.isHighlight = isHighlight.select === Graph_1.SelectEnum.Line
                && isHighlight.index === line.lineIndex;
        }
        DrawingHelper_1.buildLine(line, startPoint, endPoint);
    };
    EditTool.prototype._drawBackShape = function (isInit) {
        var backShape = this._backShape;
        if (isInit) {
            backShape.name = "editShape";
            backShape.interactive = true;
            this._selectHandler(backShape, Graph_1.SelectEnum.Shape);
            this._layer.addChildAt(backShape, 0);
        }
        else {
            backShape.clear();
        }
        var con = JSON.parse(JSON.stringify(this._content));
        con.backgroundAlpha = 0.8;
        var parent = this._container.parent;
        DrawingHelper_1.drawShape(backShape, this._shape, parent.scale.x, con);
    };
    EditTool.prototype._drawEditLayer = function (isInit, isHighlight) {
        this._drawBackShape(isInit);
        // 删除null 测试出现的bug：原因估计是项目代码更新时造成的，理应不出现null
        this._shape = this._shape.filter(function (n) { return n !== null; });
        for (var i = 0; i < this._shape.length; i++) {
            this._drawPoint(i, isInit, isHighlight);
            this._drawLine(i, isInit, isHighlight);
        }
        if (isInit) {
            DragHelper_1.default(this._layer);
        }
    };
    EditTool.prototype.addSelectHandler = function (handler) {
        this._selectHandler = handler;
    };
    EditTool.prototype.addUpdateHandler = function (handler) {
        this._updateHandler = handler;
    };
    EditTool.prototype.addPoint = function (lineIndex) {
        var newShape = this._shape;
        var pre = newShape[lineIndex];
        var next = newShape[lineIndex === (newShape.length - 1) ? 0 : (lineIndex + 1)];
        var newPoint = [
            Math.round((next[0] + pre[0]) / 2),
            Math.round((next[1] + pre[1]) / 2)
        ];
        newShape.splice(lineIndex + 1, 0, newPoint);
        this.init(newShape, this._content);
        this._updateHandler(newShape);
        this.select(Graph_1.SelectEnum.Point, lineIndex + 1);
    };
    EditTool.prototype.select = function (select, index) {
        var _this = this;
        var targetIndex;
        var preIndex;
        var nextIndex;
        var preLine;
        var prePoint;
        var nextPoint;
        var nextLine;
        this._layer.interactive = false;
        switch (select) {
            case Graph_1.SelectEnum.Point:
                this._drawEditLayer(false, { select: select, index: index });
                var targetPoint_1 = this._pointLayer.getChildByName("point_" + index);
                // 只关心在layer里面的队形，不关心name里的index
                targetIndex = this._pointLayer.getChildIndex(targetPoint_1);
                preIndex = targetIndex === 0 ? (this._pointLayer.children.length - 1) : (targetIndex - 1);
                preLine = this._lineLayer.getChildAt(preIndex);
                nextLine = this._lineLayer.getChildAt(targetIndex);
                addPointDragHandler(preLine, targetPoint_1, nextLine, function (point) {
                    _this._shape[targetPoint_1.pointIndex] = point;
                    _this._drawEditLayer(false, { select: select, index: index });
                    _this._updateHandler(_this._shape);
                });
                break;
            case Graph_1.SelectEnum.Line:
                this._drawEditLayer(false, { select: select, index: index });
                var targetLine = this._lineLayer.getChildByName("line_" + index);
                // 只关心在layer里面的队形，不关心name里的index
                targetIndex = this._lineLayer.getChildIndex(targetLine);
                preIndex = targetIndex === 0 ? (this._lineLayer.children.length - 1) : (targetIndex - 1);
                nextIndex = targetIndex === (this._lineLayer.children.length - 1) ? 0 : (targetIndex + 1);
                preLine = this._lineLayer.getChildAt(preIndex);
                prePoint = this._pointLayer.getChildAt(targetIndex);
                nextPoint = this._pointLayer.getChildAt(nextIndex);
                nextLine = this._lineLayer.getChildAt(nextIndex);
                addLineDragHandler(preLine, prePoint, targetLine, nextPoint, nextLine, function (pP, nP) {
                    _this._shape[prePoint.pointIndex] = pP;
                    _this._shape[nextPoint.pointIndex] = nP;
                    _this._drawEditLayer(false, { select: select, index: index });
                    _this._updateHandler(_this._shape);
                });
                break;
            case Graph_1.SelectEnum.Shape:
                this._layer.interactive = true;
                this._drawEditLayer(false, true);
                addShapeDragHandler(this._layer, function (startPoint, endPoint) {
                    if ((startPoint.x !== endPoint.x) || (startPoint.y != endPoint.y)) {
                        var x_1 = endPoint.x - startPoint.x;
                        var y_1 = endPoint.y - startPoint.y;
                        var newShape_1 = [];
                        _this._shape.forEach(function (item, i) {
                            newShape_1.push([Math.round(item[0] + x_1), Math.round(item[1] + y_1)]);
                        });
                        _this._shape = newShape_1;
                        _this._drawEditLayer(false, true);
                        _this._updateHandler(newShape_1);
                    }
                });
            default:
                break;
        }
    };
    EditTool.prototype.destroy = function () {
        this._layer.destroy(true);
        this._buildLayer();
    };
    return EditTool;
}());
exports.default = EditTool;
function addShapeDragHandler(shape, handler) {
    var startPoint = new PIXI.Point();
    startPoint.copy(shape.position);
    var endPoint = new PIXI.Point();
    var onDragEnd = function () {
        endPoint.copy(shape.position);
        handler(startPoint, endPoint);
        shape.x = 0;
        shape.y = 0;
        shape.off('pointerup', onDragEnd)
            .off('pointerupoutside', onDragEnd);
    };
    shape.on("pointerup", onDragEnd)
        .on('pointerupoutside', onDragEnd);
}
function addPointDragHandler(preLine, point, nextLine, handler) {
    var onDragMove = function () {
        var preLineStart = preLine.startPoint;
        preLine.clear();
        DrawingHelper_1.buildLine(preLine, preLineStart, [point.x, point.y]);
        var nextLineEnd = nextLine.endPoint;
        nextLine.clear();
        DrawingHelper_1.buildLine(nextLine, [point.x, point.y], nextLineEnd);
    };
    var onDragEnd = function () {
        handler([
            Math.round(point.x),
            Math.round(point.y)
        ]);
        point.off('pointermove', onDragMove)
            .off('pointerup', onDragEnd)
            .off('pointerupoutside', onDragEnd);
    };
    point.on('pointermove', onDragMove)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd);
}
function addLineDragHandler(preLine, prePoint, line, nextPoint, nextLine, handler) {
    var pPoint = prePoint;
    pPoint.dragObjStart = new PIXI.Point();
    pPoint.dragObjStart.copy(pPoint.position);
    var nPoint = nextPoint;
    nPoint.dragObjStart = new PIXI.Point();
    nPoint.dragObjStart.copy(nPoint.position);
    var onDragMove = function () {
        var dLine = line;
        var dx = dLine.x - dLine.dragObjStart.x;
        var dy = dLine.y - dLine.dragObjStart.y;
        prePoint.x = dx + pPoint.dragObjStart.x;
        prePoint.y = dy + pPoint.dragObjStart.y;
        nextPoint.x = dx + nPoint.dragObjStart.x;
        nextPoint.y = dy + nPoint.dragObjStart.y;
        var preLineStart = preLine.startPoint;
        preLine.clear();
        DrawingHelper_1.buildLine(preLine, preLineStart, [prePoint.x, prePoint.y]);
        var nextLineEnd = nextLine.endPoint;
        nextLine.clear();
        DrawingHelper_1.buildLine(nextLine, [nextPoint.x, nextPoint.y], nextLineEnd);
    };
    var onDragEnd = function () {
        line.clear();
        line.x = 0;
        line.y = 0;
        var pP = [
            Math.round(prePoint.x),
            Math.round(prePoint.y)
        ];
        var nP = [
            Math.round(nextPoint.x),
            Math.round(nextPoint.y)
        ];
        DrawingHelper_1.buildLine(line, pP, nP);
        handler(pP, nP);
        line.off('pointermove', onDragMove)
            .off('pointerup', onDragEnd)
            .off('pointerupoutside', onDragEnd);
    };
    line.on('pointermove', onDragMove)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd);
}
