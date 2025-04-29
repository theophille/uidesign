import { DRAWABLES, DRAWABLES_LABELS, TOOL_TYPES, TOOLS } from "../constants/constants";
import { CustomShape } from "./customShape";
import { Drawable } from "./drawable";
import { Ellipse } from "./ellipse";
import { Line } from "./line";
import { Polygon } from "./polygon";
import { Rectangle } from "./rectangle";
import { Text } from "./text";

export class DrawableFactory {
  private static count = {
    rectangle: 0,
    ellipse: 0,
    polygon: 0,
    line: 0,
    customShape: 0,
    text: 0,
    image: 0
  }

  public static createFromBox(what: string, startX: number, startY: number,
    endX: number, endY: number): Drawable | null {
    
    const w = endX - startX;
    const h = endY - startY;
    const x = Math.round(startX);
    const y = Math.round(startY);

    return this.createFromData(what, {
      x: x,
      y: y,
      width: w,
      height: h,
      rotation: 0
    });
  }

  public static createFromData(what: string, data: any, label?: string): Drawable | null {
    if (what === TOOL_TYPES.rectangle) {
      const id = this.count.rectangle++;
      const l = label ? label : `${DRAWABLES_LABELS.rectangle} ${id}`;
      let rectangle = new Rectangle({ ...data, label: l });
      return rectangle;
    }

    if (what == TOOL_TYPES.ellipse) {
      const id = this.count.ellipse++;
      const l = label ? label : `${DRAWABLES_LABELS.ellipse} ${id}`;
      let ellipse = new Ellipse({ ...data, label: l });
      return ellipse;
    }

    if (what == TOOL_TYPES.polygon) {
      const id = this.count.polygon++;
      const l = label ? label : `${DRAWABLES_LABELS.polygon} ${id}`;
      let polygon = new Polygon({ ...data, label: l });
      return polygon;
    }

    if (what == TOOL_TYPES.line) {
      const id = this.count.line++;
      const l = label ? label : `${DRAWABLES_LABELS.line} ${id}`;
      let line = new Line({ ...data, label: l });
      return line;
    }

    if (what == TOOL_TYPES.pen) {
      const id = this.count.customShape++;
      const l = label ? label : `${DRAWABLES_LABELS.customShape} ${id}`;
      let customShape = new CustomShape({ ...data, label: l });
      return customShape;
    }
    
    if (what === TOOL_TYPES.text) {
      const id = this.count.text++;
      const l = label ? label : `${DRAWABLES_LABELS.text} ${id}`;
      let text = new Text({ ...data, label: l });
      return text;
    }

    return null;
  }
}