/*
 * @Description: 常量
 */

import { ShapeContent, LineStyle } from "../common/Graph";

export const defultGraphStyle: ShapeContent = {
    backgroundAlpha: 1,
    backgroundColor: 0xD1D8DF,
    border: {
        lineWidth: 1,
        color: 0xA7ACB2,
        lineStyle: LineStyle.Solid
    },
    font: {
        fontSize: 14,
        fill: [0x000000]
    },
    content: "",
    hasMark: false,
    alpha: 1,
    interactive: true
    //shapeIndex: ""
}
