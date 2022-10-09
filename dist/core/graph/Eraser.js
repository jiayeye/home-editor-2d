"use strict";
/*
 * @Author: xujiawen
 * @Description: 橡皮擦
 * @Date: 2018-04-26 11:00:54
 * @Last Modified by:   xujiawen
 * @Last Modified time: 2018-04-26 11:00:54
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Eraser = /** @class */ (function () {
    function Eraser(interaction, extraLayer, shapeLayer, callback, state, graphContainer) {
        this._deletePointArr = []; //保存要删除的点的index
        this._isErase = false; //记录是否mousedown
        this._interaction = interaction;
        this._extraLayer = extraLayer;
        this._callback = callback;
        this._shapeLayer = shapeLayer;
        this._state = state;
        this._graphContainer = graphContainer;
    }
    Eraser.prototype.buildCircle = function (radius) {
        if (radius === void 0) { radius = 10; }
        //画个圆
        var circle = new PIXI.Graphics();
        circle.beginFill(0xffffff, 0);
        circle.lineStyle(1, 0x000, 1);
        circle.drawCircle(0, 0, radius);
        circle.endFill();
        this._eraserSize = radius;
        return circle;
    };
    Eraser.prototype.enable = function () {
        var _this = this;
        //开启前先销毁 避免生成多个
        this.disable();
        this._circleCursor = new PIXI.Sprite();
        this._circleCursor.name = "eraser";
        this._circleCursor.addChild(this.buildCircle());
        this._circleCursor.x = -1000; //让初始化位置在屏幕外
        this._circleCursor.y = -1000;
        this._circleCursor.interactive = true;
        //bindEvent
        this._circleCursor.on("pointerdown", function (event) {
            _this._isErase = true;
            _this._findDeletePoints(event.data.global.x, event.data.global.y);
        }).on("mousemove", function (event) {
            if (_this._isErase) {
                _this._findDeletePoints(event.data.global.x, event.data.global.y);
            }
        }).on("pointerup", function (event) {
            _this._isErase = false;
            _this._callback(_this._deletePointArr);
            //this._extraLayer.setChildIndex(this._circleCursor, this._extraLayer.children.length - 1);
            _this._deletePointArr = [];
        });
        //eraser开启状态 禁止children事件触发.interactiveChildren = false;
        this._changeInteractive(false);
        //放置在编辑层
        this._state.addChild(this._circleCursor);
        //隐藏默认的鼠标指针 修改的其实是css
        this._interaction.cursorStyles.default = "none";
        //跟着鼠标走
        this._cursorTicker = new PIXI.ticker.Ticker();
        this._cursorTicker.speed = 0.5;
        this._cursorTicker.add(function () {
            var mousePosition = _this._interaction.mouse.global;
            _this._circleCursor.x = mousePosition.x;
            _this._circleCursor.y = mousePosition.y;
        }).start();
    };
    Eraser.prototype.disable = function () {
        if (!this._cursorTicker) {
            return;
        }
        if (!this._cursorTicker.started) {
            return;
        }
        this._changeInteractive(true);
        this._interaction.cursorStyles.default = "auto";
        this._cursorTicker.destroy();
        this._circleCursor.destroy();
    };
    Eraser.prototype.setSize = function (size) {
        this._circleCursor.removeChildren();
        this._circleCursor.addChild(this.buildCircle(size));
    };
    Eraser.prototype._changeInteractive = function (state) {
        var extraLayer = this._extraLayer.getChildByName("editLayer");
        extraLayer.interactive = state;
        extraLayer.children.forEach(function (item) {
            item.interactive = state;
            item.interactiveChildren = state;
        });
        this._shapeLayer.interactiveChildren = state;
    };
    Eraser.prototype._findDeletePoints = function (x, y) {
        //计算没有放大缩小、位移前的 x、y
        x = (x - this._graphContainer.position.x) / this._graphContainer.scale.x;
        y = (y - this._graphContainer.position.y) / this._graphContainer.scale.y;
        var pointR = 3; //编辑点圆点半径
        var eraserR = Number(this._eraserSize);
        var minSize = (pointR + eraserR) / this._graphContainer.scale.x;
        // 如果只有三个点 不能擦除
        var editLayer = this._extraLayer.getChildByName("editLayer");
        var pointLayer = editLayer.getChildByName("pointLayer");
        for (var i = 0; i < pointLayer.children.length; i++) {
            if (pointLayer.children.length - this._deletePointArr.length === 3) {
                break;
            }
            var item = pointLayer.children[i];
            //如果已经是要删除的点 就不需要再次判断
            if (item.alpha == 0.3) {
                continue;
            }
            var xAbs = Math.abs(x - item.x);
            var yAbs = Math.abs(y - item.y);
            if ((xAbs < minSize) && (yAbs < minSize)) {
                //point修改透明度，表示要删除
                item.alpha = 0.3;
                this._deletePointArr.push(i);
            }
        }
    };
    return Eraser;
}());
exports.default = Eraser;
