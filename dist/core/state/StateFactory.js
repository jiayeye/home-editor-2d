"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State_1 = require("./State");
var Graph_1 = require("../common/Graph");
function StateFactory(eEnum, sEnum, enableEraser, index) {
    var ee = Graph_1.EditEnum;
    var se = Graph_1.SelectEnum;
    switch (true) {
        case ((eEnum === ee.Editing) && enableEraser):
            return new State_1.EditingEraserState(index, sEnum);
        case ((eEnum === ee.Editing) && (sEnum === se.None)):
            return new State_1.EditingNoneState(index, sEnum);
        case ((eEnum === ee.Editing) && (sEnum === se.Shape)):
        case ((eEnum === ee.Editing) && (sEnum === se.Line)):
        case ((eEnum === ee.Editing) && (sEnum === se.Point)):
            return new State_1.EditingSelectState(index, sEnum);
        case ((eEnum === ee.Nomal) && enableEraser):
            return new State_1.NomalNoneState(index, sEnum);
        case ((eEnum === ee.Nomal) && (sEnum === se.Shape)):
            return new State_1.NomalSelectState(index, sEnum);
        case ((eEnum === ee.Nomal) && (sEnum === se.None)):
        default:
            return new State_1.NomalNoneState(index, sEnum);
    }
}
exports.default = StateFactory;
