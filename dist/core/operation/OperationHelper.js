"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 放大缩小后修改文字 避免文字放大缩小
function changeTextStyle(scale, graphCon) {
    var changeText = function (text) {
        var oldScale = text.scale.x;
        var newScale = 1 / scale;
        text.scale.x = newScale;
        text.scale.y = newScale;
        var DValue = newScale - oldScale;
        text.position.x -= DValue * text.width * scale / 2;
        text.position.y -= DValue * text.height * scale / 2;
    };
    // 底部
    var shapeLayer = graphCon.getChildByName('shapeLayer');
    shapeLayer.children.forEach(function (item) {
        if (item.children.length > 0) {
            var text = item.getChildByName("text");
            changeText(text);
        }
    });
    // 编辑层
    var extraLayer = graphCon.getChildByName('extraLayer');
    var editLayer = extraLayer.getChildByName('editLayer');
    var editShape = editLayer.getChildByName('editShape');
    if (editShape && editShape.children.length > 0) {
        var text = editShape.getChildByName("text");
        changeText(text);
    }
}
exports.changeTextStyle = changeTextStyle;
