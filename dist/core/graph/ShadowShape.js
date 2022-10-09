"use strict";
/*
 * @Author: xujiawen
 * @Description: 跟随鼠标的透明块
 * @Date: 2018-04-26 11:01:07
 * @Last Modified by: xujiawen
 * @Last Modified time: 2018-04-26 11:01:35
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ShadowShape = /** @class */ (function () {
    function ShadowShape(app) {
        this._shadowMatching = false; //是否开启匹配模式
        this._app = app;
    }
    ShadowShape.prototype.buildShadowShape = function (width, height, content) {
        var _this = this;
        this.destroyShadowShape();
        var shape;
        shape = [[0, 0], [0, height], [width, height], [width, 0]];
        this._shadowMatching = true;
        this._shadowMatchingCon = content;
        this._shadowShape = this._app.graphManager.buildShadowShapes(shape, content);
        //如果放在Container 放大缩小会对它有影响
        this._app.pixiApp.stage.addChild(this._shadowShape);
        //跟着鼠标走
        this._shadowTicker = new PIXI.ticker.Ticker();
        this._shadowTicker.add(function () {
            // if (this._app.pixiApp.renderer.plugins.interaction.eventData.type == "pointertap") {
            //     this._deleteShadowShape();
            //     return;
            // }
            var mousePosition = _this._app.pixiApp.renderer.plugins.interaction.mouse.global;
            _this._shadowShape.x = mousePosition.x - width - 5;
            _this._shadowShape.y = mousePosition.y - height - 5;
        }).start();
    };
    // shapeOver(shapeIndex: number) {
    //     if (this._shadowMatching) {
    //         let shape = this._app.actionManager.getCurrentShape(shapeIndex);
    //         let colorCon: ShapeContent = JSON.parse(JSON.stringify(this._shadowMatchingCon));
    //         colorCon.content = "";
    //         colorCon.alpha = 1;
    //         colorCon.hasMark = false;
    //         this._app.graphManager.updateShapes(shape, shapeIndex, colorCon)
    //         // this._app.graphManager.updateShapes(shape, shapeIndex, this._app.operationShadowShape._shadowMatchingCon)
    //     }
    // }
    // shapeOut(shapeIndex: number): void {
    //     if (this._shadowMatching) {
    //         let index = shapeIndex;
    //         let shape = this._app.actionManager.getCurrentShape(index);
    //         this._app.graphManager.updateShapes(shape, shapeIndex)
    //     }
    // }
    // shapePionterUp(shapeIndex: number): void {
    //     if (this._shadowMatching) {
    //         let index = shapeIndex;
    //         let shape = this._app.actionManager.getCurrentShape(shapeIndex);
    //         this._shadowMatchingCon.hasMark = false;
    //         this._shadowMatchingCon.alpha = 1;
    //         this._app.graphManager.updateShapes(shape, shapeIndex, this._shadowMatchingCon)
    //         //更新数据
    //         this._app.graphManager.graph.shapesContent[index] = this._shadowMatchingCon;
    //         this._shadowMatching = false;
    //         this.deleteShadowShape();
    //     }
    // }
    ShadowShape.prototype.destroyShadowShape = function () {
        if (!this._shadowTicker) {
            return;
        }
        if (!this._shadowTicker.started) {
            return;
        }
        this._shadowTicker.destroy();
        this._shadowShape.destroy();
    };
    return ShadowShape;
}());
exports.default = ShadowShape;
