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
var DragHelper_1 = require("./DragHelper");
var Eraser_1 = require("./Eraser");
var GraphDrawing_1 = require("./GraphDrawing");
var EditTool_1 = require("./EditTool");
var constant_1 = require("./constant");
var RegionDelete_1 = require("./RegionDelete");
var GraphManager = /** @class */ (function (_super) {
    __extends(GraphManager, _super);
    function GraphManager(app) {
        var _this = _super.call(this, app) || this;
        _this._backgroundLayer = new PIXI.Container();
        _this._backgroundLayer.name = "backgroundLayer";
        _this._extraLayer = new PIXI.Container();
        _this._extraLayer.visible = false;
        _this._extraLayer.name = "extraLayer";
        _this._extraLayer.interactive = true;
        _this.graphContainer.addChildAt(_this._backgroundLayer, 0);
        _this.graphContainer.addChild(_this._extraLayer);
        _this.graphContainer.interactive = true;
        DragHelper_1.default(_this.graphContainer);
        _this._editTool = new EditTool_1.default(_this._extraLayer);
        _this._eraser = new Eraser_1.default(_this._app.pixiApp.renderer.plugins.interaction, _this._extraLayer, _this._shapeLayer, _this._editTool.erasePoints(), _this._app.pixiApp.stage, _this.graphContainer);
        _this._regionDelete = new RegionDelete_1.default(_this._app, _this._extraLayer, _this._shapeLayer);
        return _this;
    }
    GraphManager.prototype._buildBackground = function (bg) {
        var _this = this;
        this._backgroundLayer.removeChildren();
        var background = PIXI.Sprite.fromImage(bg.url);
        background.alpha = bg.alpha || 1;
        background.hitArea = new PIXI.Rectangle(-10000000, -10000000, 100000000000000, 100000000000000);
        background.interactive = true;
        // background.on('pointerdown', () => {
        //     this._app.stateManager.select(SelectEnum.None, []);
        // });
        var hasMouseUp = true;
        background.on('pointerdown', function (event) {
            hasMouseUp = true;
            setTimeout(function () {
                hasMouseUp = false;
            }, 500);
        });
        background.on('pointerup', function (event) {
            if (hasMouseUp) {
                _this._app.stateManager.select(Graph_1.SelectEnum.None, []);
            }
        });
        this._backgroundLayer.addChild(background);
    };
    GraphManager.prototype._focus = function (isEditing, shapeIndex) {
        // 进入选中状态，虚化shapeLayer
        if (isEditing) {
            // 编辑状态时，禁用底层的拖拽
            this.graphContainer.interactive = false;
            DragHelper_1.default(this.graphContainer, false);
        }
        this._extraLayer.visible = true;
        this._changeAllShapesColor(true, shapeIndex);
    };
    GraphManager.prototype._blur = function (isEditing) {
        // 释放选中状态，恢复shapeLayer
        if (isEditing) {
            this.graphContainer.interactive = true;
            DragHelper_1.default(this.graphContainer, true);
        }
        this._extraLayer.visible = false;
        this._changeAllShapesColor(false);
    };
    // shapeIndex:要隐藏的index
    GraphManager.prototype._changeAllShapesColor = function (isWhite, shapeIndex) {
        var _this = this;
        this._shapeLayer.children.forEach(function (item) {
            var curShape = _this._app.actionManager.getCurrentShape(item.shapeIndex);
            var isVisible = shapeIndex == item.shapeIndex ? false : true;
            _this._changeShapeColor(curShape, item.shapeIndex, isWhite, isVisible);
        });
    };
    //选中shape时 修改颜色
    GraphManager.prototype._changeShapeColor = function (shape, shapeIndex, isWhite, isVisible) {
        if (isVisible === void 0) { isVisible = true; }
        if (shape.length !== 0) {
            var content = this._graphCache.shapesContent[shapeIndex];
            var defaultStyle = constant_1.defultGraphStyle;
            var con = content ? content : defaultStyle;
            var deepCopyCon = JSON.parse(JSON.stringify(con));
            if (isWhite) {
                deepCopyCon.backgroundAlpha = 1;
                deepCopyCon.backgroundColor = 0xffffff;
                deepCopyCon.border.color = 0xe5e5e5;
                deepCopyCon.font.fill = [0xc6c6c6];
            }
            this._shapeLayer.getChildByName(shapeIndex.toString()).visible = isVisible;
            this.updateShapes(shape, shapeIndex, deepCopyCon, true);
        }
    };
    GraphManager.prototype.setGraph = function (graph, cache, callBack) {
        this._graphCache = cache;
        this._shapeLayer.removeChildren();
        this._buildBackground(cache.background);
        for (var i = 0; i < graph.shapes.length; i++) {
            this.buildShapes(graph.shapes[i], i, cache.shapesContent[i]);
        }
        this._loaderBgImg(cache.background, callBack); // 背景图片加载好后执行回调
    };
    GraphManager.prototype.setShapeContent = function (index, content) {
        var shape = this._app.actionManager.getCurrentShape(index);
        //店铺匹配时保存content
        this._graphCache.shapesContent[index] = content;
        this.updateShapes(shape, index, content, true);
    };
    // 背景图片加载
    GraphManager.prototype._loaderBgImg = function (bg, callBack) {
        var loader = new PIXI.loaders.Loader();
        loader.add('bgimg', bg.url).load(function () {
            //this._buildBackground(bg);
            if (callBack) {
                callBack();
            }
        });
    };
    GraphManager.prototype._addLayer = function (shapeIndex, isDisplay) {
        var shape = this._app.actionManager.getCurrentShape(shapeIndex);
        var content = this._graphCache.shapesContent[shapeIndex];
        this._editTool.init(shape, content, isDisplay);
        this._focus(!isDisplay, shapeIndex);
    };
    GraphManager.prototype._addHandler = function (shapeIndex) {
        var _this = this;
        this._editTool.addUpdateHandler(function (shape) {
            _this._app.actionManager.updateShape(shape, shapeIndex);
        });
        this._editTool.addSelectHandler(function (target, state, idx) {
            target.shapeIndex = shapeIndex;
            target.on('pointerdown', function () {
                _this._app.stateManager.select(state, [shapeIndex, idx]);
            });
            if (state === Graph_1.SelectEnum.Shape || state === Graph_1.SelectEnum.Line) {
                _this._app.eventManager.bindHandler(state, target);
            }
        });
    };
    GraphManager.prototype.addDisplayLayer = function (isNeedInit, index) {
        if (isNeedInit) {
            this._addHandler(index[0]);
            this._addLayer(index[0], true);
        }
    };
    GraphManager.prototype.addEditLayer = function (isNeedInit, index, select) {
        if (isNeedInit) {
            this._addHandler(index[0]);
            this._addLayer(index[0], false);
        }
        this._editTool.select(select, index[1]);
    };
    GraphManager.prototype.removeLayer = function () {
        // 关闭编辑状态，清除橡皮擦
        this._editTool.destroy();
        this._eraser.disable();
        this._blur(true);
    };
    GraphManager.prototype.setEraserSize = function (size) {
        this._eraser.setSize(size);
    };
    GraphManager.prototype.setShadowShape = function (width, height, content) {
        this._app.stateManager.select(Graph_1.SelectEnum.None, []);
        this._shadowShape.buildShadowShape(width, height, content);
    };
    GraphManager.prototype.deleteShadowShape = function () {
        this._shadowShape.destroyShadowShape();
    };
    GraphManager.prototype.addPoint = function (lineIndex) {
        this._editTool.addPoint(lineIndex);
    };
    GraphManager.prototype.enableEraser = function (isEnabled) {
        if (isEnabled) {
            this._eraser.enable();
        }
        else {
            this._eraser.disable();
        }
    };
    GraphManager.prototype.enableRegionDelete = function (isEnabled, callBack) {
        this._regionDelete.enable(isEnabled, callBack);
    };
    return GraphManager;
}(GraphDrawing_1.default));
exports.default = GraphManager;
