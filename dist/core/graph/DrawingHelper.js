"use strict";
/*
 * @Description: 画块、边、点
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Graph_1 = require("../common/Graph");
var constant_1 = require("./constant");
function drawShape(graphics, shape, textScale, content) {
    if (content === void 0) { content = constant_1.defultGraphStyle; }
    var hasMoveTo = false; //判断graph是否开始画：因为第一个点有可能被擦除 是null
    var moveToPoint = [0, 0]; //记录第一个开始画的点 用于最后再画一次
    var xMin, xMax, yMin, yMax;
    graphics.removeChildren();
    // set a fill and line style
    graphics.beginFill(content.backgroundColor, content.backgroundAlpha == undefined ? content.alpha : content.backgroundAlpha);
    if (content.border.lineStyle === Graph_1.LineStyle.Solid) {
        graphics.lineStyle(content.border.lineWidth, content.border.color, 1);
    }
    graphics.alpha = content.alpha; // 透明度
    graphics.interactive = content.interactive == undefined ? true : content.interactive; // 为定义则默认开启
    // draw a shape
    for (var i = 0; i < shape.length; i++) {
        if (!shape[i]) {
            continue;
        }
        if (!hasMoveTo) {
            graphics.moveTo(shape[i][0], shape[i][1]);
            moveToPoint = shape[i];
            hasMoveTo = true;
            xMin = moveToPoint[0];
            xMax = moveToPoint[0];
            yMin = moveToPoint[1];
            yMax = moveToPoint[1];
        }
        else {
            graphics.lineTo(shape[i][0], shape[i][1]);
        }
        //查找shape的边界
        xMin = xMin > shape[i][0] ? shape[i][0] : xMin;
        xMax = xMax < shape[i][0] ? shape[i][0] : xMax;
        yMin = yMin > shape[i][1] ? shape[i][1] : yMin;
        yMax = yMax < shape[i][1] ? shape[i][1] : yMax;
    }
    graphics.xMin = xMin;
    graphics.xMax = xMax;
    graphics.yMin = yMin;
    graphics.yMax = yMax;
    graphics.lineTo(moveToPoint[0], moveToPoint[1]);
    graphics.endFill();
    //画虚线
    if (content.border.lineStyle === Graph_1.LineStyle.Dashed) {
        drawDashed(graphics, shape, content);
    }
    //文字
    if (content.content) {
        drawText(graphics, content, textScale);
    }
    //角标
    if (content.hasMark) {
        //根据右下角的点画一个三角形
        drawMark(graphics, content);
    }
    return graphics;
}
exports.drawShape = drawShape;
//shape：画虚线
function drawDashed(graphics, shape, content) {
    var dashLength = 5; // 虚线每段长度 
    var borderAlpha = 1; // 虚线的透明度
    var excessLength = 0; // 亮点之间多余的虚线长度
    var hasMoveTo = false;
    var moveToPoint = [0, 0];
    graphics.beginFill(content.backgroundColor, 0);
    for (var i = 0; i <= shape.length; i++) {
        // 排除删除的点和加一次循环 画成闭合曲线
        if (!shape[i] && (i < shape.length)) {
            continue;
        }
        if (!hasMoveTo) {
            graphics.moveTo(shape[i][0], shape[i][1]);
            moveToPoint = shape[i];
            hasMoveTo = true;
            continue;
        }
        var point1 = shape[i - 1]; // 上一个点
        var point2 = shape[i];
        if (i == shape.length) {
            point1 = shape[i - 1];
            point2 = moveToPoint;
        }
        // 两点之间的长度
        var line = Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
        var mulriple = line / dashLength;
        var drawLineto = function (x, y) {
            borderAlpha = Math.abs(borderAlpha - 1);
            graphics.lineTo(x, y);
            graphics.lineStyle(content.border.lineWidth, content.border.color, borderAlpha);
        };
        if (mulriple > 1) {
            var x = point1[0];
            var y = point1[1];
            if (excessLength) {
                var addLine = dashLength - excessLength; // 需要补的长度
                var addMul = line / addLine;
                x = point1[0] + (point2[0] - point1[0]) / addMul;
                y = point1[1] + (point2[1] - point1[1]) / addMul;
                drawLineto(x, y);
                line = line - addLine;
            }
            for (var j = line / dashLength; j >= 1; j--) {
                x += (point2[0] - point1[0]) / mulriple;
                y += (point2[1] - point1[1]) / mulriple;
                drawLineto(x, y);
            }
            if (x !== point2[0]) {
                graphics.lineTo(point2[0], point2[1]);
                excessLength = line % dashLength;
            }
        }
        else {
            //  excessLength += line;
            if (excessLength + line > dashLength) {
                var addLine = dashLength - excessLength; // 需要补的长度
                var addMul = line / addLine;
                var x = point1[0] + (point2[0] - point1[0]) / addMul;
                var y = point1[1] + (point2[1] - point1[1]) / addMul;
                drawLineto(x, y);
                excessLength = excessLength + line - dashLength;
                if (x !== point2[0]) {
                    graphics.lineTo(point2[0], point2[1]);
                }
            }
            else {
                excessLength += line;
                graphics.lineTo(point2[0], point2[1]);
            }
        }
    }
    graphics.endFill();
}
//shape：文字
function drawText(graphics, content, textScale) {
    var maskGraph = graphics.clone();
    var textStyle = new PIXI.TextStyle({
        fontSize: content.font.fontSize,
        fill: content.font.fill,
        wordWrap: true,
        wordWrapWidth: graphics.xMax - graphics.xMin,
        breakWords: true
    });
    var text = new PIXI.Text(content.content, textStyle);
    text.name = "text";
    text.position.x = (graphics.xMin + graphics.xMax) / 2 - text.width / 2;
    text.position.y = (graphics.yMin + graphics.yMax) / 2 - text.height / 2;
    graphics.addChild(maskGraph);
    // 文字超出后隐藏
    text.mask = maskGraph;
    var newScale = 1 / textScale;
    text.scale.x = newScale;
    text.scale.y = newScale;
    text.position.x += text.width * (textScale - 1) / 2;
    text.position.y += text.height * (textScale - 1) / 2;
    graphics.addChild(text);
}
//shape：角标
function drawMark(graphics, content) {
    graphics.beginFill(content.backgroundColor, 1);
    graphics.lineStyle();
    graphics.moveTo(graphics.xMax - 20, graphics.yMax);
    graphics.lineTo(graphics.xMax, graphics.yMax);
    graphics.lineTo(graphics.xMax, graphics.yMax - 20);
    graphics.lineTo(graphics.xMax - 20, graphics.yMax);
    graphics.endFill();
}
//line
function buildLine(line, start, end) {
    var color = line.isHighlight ? 0x7ed321 : 0xa7acb2;
    var radius = 2;
    line.lineStyle(1, color, 1);
    line.beginFill(color, 1);
    var radians = Math.atan2(end[1] - start[1], end[0] - start[0]);
    var dx = Math.sin(radians) * radius;
    var dy = Math.cos(radians) * radius;
    var poly = new PIXI.Polygon(new PIXI.Point(start[0] + dx, start[1] - dy), new PIXI.Point(end[0] + dx, end[1] - dy), new PIXI.Point(end[0] - dx, end[1] + dy), new PIXI.Point(start[0] - dx, start[1] + dy));
    line.drawPolygon(poly);
    line.hitArea = poly;
    line.endFill();
    line.startPoint = start;
    line.endPoint = end;
}
exports.buildLine = buildLine;
//point
function buildPoint(graphics, point) {
    var color = graphics.isHighlight ? 0x548f14 : 0xa7acb2;
    graphics.beginFill(color, 1);
    graphics.drawCircle(0, 0, 3);
    graphics.x = point[0];
    graphics.y = point[1];
    graphics.endFill();
    graphics.point = point;
}
exports.buildPoint = buildPoint;
