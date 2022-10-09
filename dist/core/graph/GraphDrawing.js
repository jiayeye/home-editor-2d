"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Graph_1 = require("../common/Graph");
var constant_1 = require("./constant");
var DrawingHelper_1 = require("./DrawingHelper");
var ShadowShape_1 = require("./ShadowShape");
var GraphDrawing = /** @class */ (function () {
    function GraphDrawing(app) {
        this._app = app;
        this._graphCache = {
            background: {
                url: "",
            },
            shapesContent: {}
        };
        this.graphContainer = new PIXI.Container();
        this.graphContainer.hitArea = new PIXI.Rectangle(-10000000, -10000000, 100000000000000, 100000000000000);
        this._shapeLayer = new PIXI.Container();
        this._shapeLayer.name = "shapeLayer";
        this.graphContainer.addChild(this._shapeLayer);
        app.pixiApp.stage.addChild(this.graphContainer);
        this._shadowShape = new ShadowShape_1.default(app);
    }
    Object.defineProperty(GraphDrawing.prototype, "graph", {
        get: function () {
            return this._graphCache;
        },
        set: function (v) {
            this._graphCache = v;
        },
        enumerable: true,
        configurable: true
    });
    GraphDrawing.prototype.buildShapes = function (shape, index, content) {
        if (content === void 0) { content = constant_1.defultGraphStyle; }
        if (!shape) {
            return;
        }
        if (shape.length < 1) {
            return;
        }
        var graphics = new Graph_1.ShapeGraphics();
        graphics = DrawingHelper_1.drawShape(graphics, shape, this.graphContainer.scale.x, content);
        this._addSelectHandler(graphics, [index]);
        graphics.name = index.toString();
        graphics.shapeIndex = index;
        this._shapeLayer.addChild(graphics);
        return graphics;
    };
    GraphDrawing.prototype.deleteShapes = function (name) {
        this._shapeLayer.removeChild(this._shapeLayer.getChildByName(name));
    };
    // hideShapes(shapeIndex: number): void {
    //     this._shapeLayer.getChildByName(shapeIndex.toString()).visible = false;
    // }
    // showShapes(shapeIndex: number): void {
    //     this._shapeLayer.getChildByName(shapeIndex.toString()).visible = true;
    // }
    GraphDrawing.prototype.updateShapes = function (shape, shapeIndex, content, keepIndex) {
        var curShape;
        curShape = this._shapeLayer.getChildByName(shapeIndex.toString());
        curShape.clear();
        content = content ? content : this._graphCache.shapesContent[shapeIndex];
        curShape = DrawingHelper_1.drawShape(curShape, shape, this.graphContainer.scale.x, content);
        if (!keepIndex) {
            this._shapeLayer.setChildIndex(curShape, this._shapeLayer.children.length - 1);
        }
    };
    //shadowShape
    GraphDrawing.prototype.buildShadowShapes = function (shape, content) {
        if (content === void 0) { content = constant_1.defultGraphStyle; }
        var graphics = new PIXI.Graphics();
        // 放大缩小对shadowShape没有影响 所以textScale传1
        graphics = DrawingHelper_1.drawShape(graphics, shape, 1, content);
        graphics.x = -1000;
        graphics.y = -1000;
        this.graphContainer.addChild(graphics);
        return graphics;
    };
    GraphDrawing.prototype._addSelectHandler = function (graphics, index) {
        var _this = this;
        graphics.interactive = true;
        var hasMouseUp = true;
        graphics.on('pointerdown', function (event) {
            hasMouseUp = true;
            setTimeout(function () {
                hasMouseUp = false;
            }, 500);
        });
        graphics.on('pointerup', function (event) {
            if (hasMouseUp) {
                _this._app.stateManager.select(Graph_1.SelectEnum.Shape, index);
            }
        });
    };
    return GraphDrawing;
}());
exports.default = GraphDrawing;
