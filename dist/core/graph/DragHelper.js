"use strict";
/*
 * @Author: xujiawen
 * @Description: 拖拽
 * @Date: 2018-04-26 11:03:18
 * @Last Modified by:   xujiawen
 * @Last Modified time: 2018-04-26 11:03:18
 */
Object.defineProperty(exports, "__esModule", { value: true });
function onDragStart(event) {
    var obj = event.currentTarget;
    obj.dragData = event.data;
    obj.dragging = 1;
    obj.dragPointerStart = event.data.getLocalPosition(obj.parent);
    obj.dragObjStart = new PIXI.Point();
    obj.dragObjStart.copy(obj.position);
    obj.dragGlobalStart = new PIXI.Point();
    obj.dragGlobalStart.copy(event.data.global);
}
function onDragEnd(event) {
    var obj = event.currentTarget;
    if (obj.dragging == 1) {
        // toggle(obj);
    }
    else {
        // snap(obj);
    }
    obj.dragging = 0;
    obj.dragData = null;
    // set the interaction data to null
}
function onDragMove(event) {
    var obj = event.currentTarget;
    if (!obj.dragging)
        return;
    var data = obj.dragData; // it can be different pointer!
    if (obj.dragging == 1) {
        // click or drag?
        if (Math.abs(data.global.x - obj.dragGlobalStart.x) +
            Math.abs(data.global.y - obj.dragGlobalStart.y) >= 3) {
            // DRAG
            obj.dragging = 2;
        }
    }
    if (obj.dragging == 2) {
        var dragPointerEnd = data.getLocalPosition(obj.parent);
        // DRAG
        obj.position.set(obj.dragObjStart.x + (dragPointerEnd.x - obj.dragPointerStart.x), obj.dragObjStart.y + (dragPointerEnd.y - obj.dragPointerStart.y));
    }
}
function DragHelper(container, enable) {
    if (enable === void 0) { enable = true; }
    if (enable) {
        container.interactive = true;
        container.on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
    }
    else {
        container.interactive = false;
        container.dragging = 0;
        container.dragData = null;
        container.off('pointerdown', onDragStart)
            .off('pointerup', onDragEnd)
            .off('pointerupoutside', onDragEnd)
            .off('pointermove', onDragMove);
    }
}
exports.default = DragHelper;
