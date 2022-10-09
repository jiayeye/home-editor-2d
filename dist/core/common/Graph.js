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
// 缓存数据结构，运行时的数据结构，用于展示。
// Shape样式
var LineStyle;
(function (LineStyle) {
    LineStyle["Dashed"] = "dashed";
    LineStyle["Solid"] = "solid";
})(LineStyle = exports.LineStyle || (exports.LineStyle = {}));
// graph添加shapeIndex属性，用于识别graphContainer.children类型
var ShapeGraphics = /** @class */ (function (_super) {
    __extends(ShapeGraphics, _super);
    function ShapeGraphics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ShapeGraphics;
}(PIXI.Graphics));
exports.ShapeGraphics = ShapeGraphics;
var LineGraphics = /** @class */ (function (_super) {
    __extends(LineGraphics, _super);
    function LineGraphics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LineGraphics;
}(PIXI.Graphics));
exports.LineGraphics = LineGraphics;
var PointGraphics = /** @class */ (function (_super) {
    __extends(PointGraphics, _super);
    function PointGraphics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PointGraphics;
}(PIXI.Graphics));
exports.PointGraphics = PointGraphics;
var EditEnum;
(function (EditEnum) {
    EditEnum["Nomal"] = "Nomal";
    EditEnum["Editing"] = "Editing";
})(EditEnum = exports.EditEnum || (exports.EditEnum = {}));
var SelectEnum;
(function (SelectEnum) {
    SelectEnum["None"] = "None";
    SelectEnum["Shape"] = "Shape";
    SelectEnum["Line"] = "Line";
    SelectEnum["Point"] = "Point";
})(SelectEnum = exports.SelectEnum || (exports.SelectEnum = {}));
