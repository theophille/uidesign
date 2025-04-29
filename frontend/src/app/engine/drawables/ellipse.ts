import { radians } from "../utils/math.utils";
import { Shape } from "./shape";

export class Ellipse extends Shape {
  constructor(params: Partial<Ellipse>) {
    super();
    Object.assign(this, params);
    this.boundingBox = this.getBoundingBoxCoords();
  }
  
  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.fill;
    context.strokeStyle = this.borderColor;
    context.lineWidth = this.borderSize;

    this.path = new Path2D();

    const x = this.x + this.anchor.x * this.width;
    const y = this.y + this.anchor.y * this.height;

    this.path.ellipse(
      Math.round(x),
      Math.round(y),
      Math.round(Math.abs(this.width / 2)),
      Math.round(Math.abs(this.height / 2)),
      radians(this.rotation),
      0, 2 * Math.PI,
      false
    );

    this.path.closePath();

    context.fill(this.path);
    context.stroke(this.path);
    context.restore();
  }
}