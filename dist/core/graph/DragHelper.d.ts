/// <reference types="pixi.js" />
export interface DragableObj extends PIXI.DisplayObject {
    dragData?: PIXI.interaction.InteractionData;
    dragging?: number;
    dragPointerStart?: PIXI.Point;
    dragObjStart?: PIXI.Point;
    dragGlobalStart?: PIXI.Point;
}
export default function DragHelper(container: DragableObj, enable?: boolean): void;
