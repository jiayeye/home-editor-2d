/// <reference types="pixi.js" />
import { RegionDeleteInterface, RegionDeleteCallBack } from "./GraphInterface";
import AppInterface from "../app/AppInterface";
export default class RegionDelete implements RegionDeleteInterface {
    private _app;
    private _extraLayer;
    private _shapeLayer;
    private _regionLayer;
    private _graph;
    private _startDown;
    private _startX;
    private _startY;
    private _hasOpen;
    private _callBack;
    constructor(app: AppInterface, extraLayer: PIXI.Container, shapeLayer: PIXI.Container);
    enable(isEnabled: boolean, callBack?: RegionDeleteCallBack): void;
    private _unbindEvent;
    private _startDraw;
    private _drawing;
    private _endDraw;
    private _changeInteractive;
}
