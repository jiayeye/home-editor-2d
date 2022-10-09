"use strict";
/*
 * @Author: xujiawen
 * @Description: 组件初始化
 * @Date: 2018-04-26 10:55:00
 * @Last Modified by: xujiawen
 * @Last Modified time: 2018-04-27 11:04:54
 */
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var GraphManager_1 = require("../graph/GraphManager");
var OperationManager_1 = require("../operation/OperationManager");
var EventManager_1 = require("../event/EventManager");
var ActionManager_1 = require("../action/ActionManager");
var StateManager_1 = require("../state/StateManager");
var App = /** @class */ (function () {
    function App(el) {
        this.pixiApp = this.init(el);
        this.graphManager = new GraphManager_1.default(this);
        this.operationManager = new OperationManager_1.default(this);
        this.eventManager = new EventManager_1.default(this);
        this.actionManager = new ActionManager_1.default(this);
        this.stateManager = new StateManager_1.default(this);
    }
    App.prototype.init = function (el) {
        var app = new PIXI.Application({
            width: el.offsetWidth,
            height: el.offsetHeight,
            backgroundColor: 0xffffff,
            antialias: true
        });
        window.addEventListener("resize", function () {
            app.renderer.resize(el.offsetWidth, el.offsetHeight);
        });
        el.appendChild(app.view);
        return app;
    };
    Object.defineProperty(App.prototype, "graph", {
        get: function () {
            return this._graph;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App.prototype, "cache", {
        get: function () {
            return this._cache;
        },
        enumerable: true,
        configurable: true
    });
    App.prototype.setGraph = function (graph, cache, callBack) {
        this._graph = graph;
        this._cache = cache;
        this.actionManager.init(graph);
        this.graphManager.setGraph(graph, cache, callBack);
        this.eventManager.bindAllHandler();
    };
    return App;
}());
exports.default = App;
