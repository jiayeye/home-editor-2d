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
var EventAPIManager = /** @class */ (function () {
    function EventAPIManager() {
        this._editState = Graph_1.EditEnum.Nomal; //state change
    }
    EventAPIManager.prototype.onClickGraph = function (callback) {
        this._events.clickGraph = callback;
        this._bindClickGraph();
    };
    ;
    EventAPIManager.prototype.onMouseEnterShape = function (callback) {
        this._events.mouseEnterShape = callback;
        this._initBindShape(callback, "mouseover");
    };
    ;
    EventAPIManager.prototype.onMouseLeaveShape = function (callback) {
        this._events.mouseLeaveShape = callback;
        this._initBindShape(callback, "mouseout");
    };
    ;
    EventAPIManager.prototype.onMouseDownShape = function (callback) {
        this._events.mouseDownShape = callback;
        this._initBindShape(callback, "pointerdown");
    };
    ;
    EventAPIManager.prototype.onMouseUpShape = function (callback) {
        this._events.mouseUpShape = callback;
        this._initBindShape(callback, "pointerup");
    };
    ;
    EventAPIManager.prototype.onMouseDownLine = function (callback) {
        this._events.mouseDownLine = callback;
        // 初始化的时候没有边
    };
    ;
    // 初始化绑定shape
    EventAPIManager.prototype._initBindShape = function (callback, event) {
        var _this = this;
        var shapeLayer = this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach(function (item, index) {
            item.on(event, _this._bindShapeFunc(callback, item));
        });
    };
    // shape的绑定事件的回调
    EventAPIManager.prototype._bindShapeFunc = function (callback, target) {
        var _this = this;
        return function (event) {
            callback([target.shapeIndex], {
                x: event.data.global.x,
                y: event.data.global.y,
                target: {
                    xMin: target.xMin,
                    xMax: target.xMax,
                    yMin: target.yMin,
                    yMax: target.yMax
                }
            }, _this._editState);
        };
    };
    // line的绑定事件的回调
    EventAPIManager.prototype._bindLineFunc = function (callback, target) {
        var _this = this;
        var index = Number(target.name.substring(5));
        return function (event) {
            var startPoint = target.startPoint, endPoint = target.endPoint;
            callback([index], {
                x: event.data.global.x,
                y: event.data.global.y,
                target: {
                    xMin: startPoint[0] < endPoint[0] ? startPoint[0] : endPoint[0],
                    xMax: startPoint[0] > endPoint[0] ? startPoint[0] : endPoint[0],
                    yMin: startPoint[1] < endPoint[1] ? startPoint[1] : endPoint[1],
                    yMax: startPoint[1] > endPoint[1] ? startPoint[1] : endPoint[1]
                }
            }, _this._editState);
        };
    };
    // 绑定graph
    EventAPIManager.prototype._bindClickGraph = function () {
        var _this = this;
        var backgroundLayer = this._app.graphManager.graphContainer.getChildByName("backgroundLayer");
        backgroundLayer.getChildAt(0).on("click", function (event) {
            _this._events.clickGraph([], {
                x: event.data.global.x,
                y: event.data.global.y
            }, _this._editState);
        });
    };
    ;
    // 绑定一个shape的所有事件
    EventAPIManager.prototype._bindShapes = function () {
        var _this = this;
        var shapeLayer = this._app.graphManager.graphContainer.getChildByName("shapeLayer");
        shapeLayer.children.forEach(function (item, index) {
            _this._bindShapeEvents(item);
        });
    };
    EventAPIManager.prototype._bindShapeEvents = function (item) {
        item.on('mouseover', this._bindShapeFunc(this._events.mouseEnterShape, item))
            .on('mouseout', this._bindShapeFunc(this._events.mouseLeaveShape, item))
            .on('pointerdown', this._bindShapeFunc(this._events.mouseDownShape, item))
            .on('pointerup', this._bindShapeFunc(this._events.mouseUpShape, item));
    };
    return EventAPIManager;
}());
var EventManager = /** @class */ (function (_super) {
    __extends(EventManager, _super);
    function EventManager(app) {
        var _this = _super.call(this) || this;
        _this._app = app;
        //初始化_events
        _this._events = {
            clickGraph: function () { },
            mouseEnterShape: function () { },
            mouseLeaveShape: function () { },
            mouseDownShape: function () { },
            mouseUpShape: function () { },
            mouseDownLine: function () { },
        };
        return _this;
    }
    EventManager.prototype.setEditState = function (state) {
        this._editState = state;
    };
    EventManager.prototype.bindAllHandler = function () {
        //this._bindClickGraph(); // new app的时候graphContainer已经生成
        this._bindShapes();
    };
    EventManager.prototype.bindHandler = function (selectType, target) {
        switch (selectType) {
            case Graph_1.SelectEnum.Shape:
                this._bindShapeEvents(target);
                break;
            case Graph_1.SelectEnum.Line:
                target.on("pointerdown", this._bindLineFunc(this._events.mouseDownLine, target));
                break;
            default:
                console.error("无法绑定该对象");
        }
    };
    return EventManager;
}(EventAPIManager));
exports.default = EventManager;
