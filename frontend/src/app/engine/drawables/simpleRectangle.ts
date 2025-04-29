import { Transform, Vec2 } from "../utils/math.utils";
import { Shape } from "./shape";

export class SimpleRect extends Shape {
  constructor(params: Partial<SimpleRect>) {
    super();
    this.anchor = {x: 0, y: 0};
    Object.assign(this, params);
    this.points = this.generatePoints();
    this.boundingBox = this.getBoundingBoxCoords();
  }

  private generatePoints(): Array<Vec2> {
    return [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 }
    ];
  }

  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.fill;
    context.strokeStyle = this.borderColor;
    context.lineWidth = this.borderSize;

    this.path = new Path2D();

    const x = this.x + this.anchor.x * this.width;
    const y = this.y + this.anchor.y * this.height;
    const points = Transform.applyTransformAround(this.points as Array<Vec2>, x, y, this.width, this.height, this.rotation, this.anchor);
    this.path.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      this.path.lineTo(current.x, current.y);
    }

    this.path.closePath();

    context.fill(this.path);
    context.stroke(this.path);
    context.restore();
  }
}