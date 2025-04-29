import { Transform, Vec2 } from "../utils/math.utils";
import { Shape } from "./shape";

export class Rectangle extends Shape {
  roundness: Array<number> = [0, 0, 0, 0];

  constructor(params: Partial<Rectangle>) {
    super();
    Object.assign(this, params);
    this.points = this.generatePoints();
    this.boundingBox = this.getBoundingBoxCoords();
  }

  private generatePoints(): Array<Vec2> {
    const mw = this.width / 2;
    const mh = this.height / 2;

    const tlr = this.roundness[0];
    const trr = this.roundness[1];
    const brr = this.roundness[2];
    const blr = this.roundness[3];

    let points: Array<Vec2> = [
      { x: Math.round(-mw), y: Math.round(mh - tlr) },
      { x: Math.round(-mw), y: Math.round(mh) },
      { x: Math.round(-mw + tlr), y: Math.round(mh) },

      { x: Math.round(mw - trr), y: Math.round(mh) },
      { x: Math.round(mw), y: Math.round(mh) },
      { x: Math.round(mw), y: Math.round(mh - trr) },

      { x: Math.round(mw), y: Math.round(-mh + brr) },
      { x: Math.round(mw), y: Math.round(-mh) },
      { x: Math.round(mw - brr), y: Math.round(-mh) },

      { x: Math.round(-mw + blr), y: Math.round(-mh) },
      { x: Math.round(-mw), y: Math.round(-mh) },
      { x: Math.round(-mw), y: Math.round(-mh + blr) }
    ];

    return points;
  }

  public override setTraslate(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.points = this.generatePoints();
  }

  public override setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.points = this.generatePoints();
  }

  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.fill;
    context.strokeStyle = this.borderColor;
    context.lineWidth = this.borderSize;

    this.path = new Path2D();
    
    const x = this.x + this.anchor.x * this.width;
    const y = this.y + this.anchor.y * this.height;
    const points = Transform.applyTransformAround(this.points as Array<Vec2>, x, y, 1, 1, this.rotation, this.anchor);
    const start = points[0];
    this.path.moveTo(start.x, start.y);

    for (let i = 1; i < points.length; i += 3) {
      const current = points[i];
      const next = points[i + 1];
      const end = (i + 2) === points.length ? start : points[i + 2];

      const radius = this.roundness[Math.round(i / 3)];
      this.path.arcTo(current.x, current.y, next.x, next.y, radius);
      this.path.lineTo(end.x, end.y);
    }

    this.path.closePath();

    context.fill(this.path);
    context.stroke(this.path);
    context.restore();
  }
}