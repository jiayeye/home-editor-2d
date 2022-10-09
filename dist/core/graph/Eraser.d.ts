/// <reference types="pixi.js" />
import { EraserInterface } from "./GraphInterface";
export default class Eraser implements EraserInterface {
    private _circleCursor;
    private _cursorTicker;
    private _interaction;
    private _extraLayer;
    private _shapeLayer;
    private _eraserSize;
    private _deletePointArr;
    private _isErase;
    private _callback;
    private _state;
    private _graphContainer;
    constructor(interaction: PIXI.interaction.InteractionManager, extraLayer: PIXI.Container, shapeLayer: PIXI.Container, callback: Function, state: PIXI.Container, graphContainer: PIXI.Container);
    private buildCircle;
    enable(): void;
    disable(): void;
    setSize(size: number): void;
    private _changeInteractive;
    private _findDeletePoints;
}
