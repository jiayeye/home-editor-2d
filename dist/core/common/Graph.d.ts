/// <reference types="pixi.js" />
export declare type Point = [number, number];
export declare type Shape = Array<Point>;
export declare type Graph = {
    shapes: Array<Shape>;
};
export declare enum LineStyle {
    Dashed = "dashed",
    Solid = "solid"
}
export declare type ShapeContent = {
    backgroundAlpha?: number;
    backgroundColor: number;
    border: {
        lineWidth: number;
        color: number;
        lineStyle: LineStyle;
    };
    font: {
        fontSize: number;
        fill: Array<number>;
    };
    content: string;
    hasMark?: boolean;
    alpha?: number;
    interactive?: boolean;
};
interface indexableContent {
    [index: number]: ShapeContent;
}
export declare type Background = {
    url: string;
    alpha?: number;
};
export interface GraphCache {
    background: Background;
    shapesContent?: indexableContent;
}
export declare class ShapeGraphics extends PIXI.Graphics {
    shapeIndex?: number;
    xMin?: number;
    xMax?: number;
    yMin?: number;
    yMax?: number;
}
export declare class LineGraphics extends PIXI.Graphics {
    lineIndex?: number;
    startPoint?: Point;
    endPoint?: Point;
    isHighlight?: boolean;
}
export declare class PointGraphics extends PIXI.Graphics {
    pointIndex?: number;
    point?: Point;
    isHighlight?: boolean;
}
export declare enum EditEnum {
    Nomal = "Nomal",
    Editing = "Editing"
}
export declare enum SelectEnum {
    None = "None",
    Shape = "Shape",
    Line = "Line",
    Point = "Point"
}
export {};
