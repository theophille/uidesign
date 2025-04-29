import { radians, Transform, Vec2 } from "../utils/math.utils";
import { Shape } from "./shape";

export class Polygon extends Shape {
  pointsCount: number = 3;

  constructor(params: Partial<Polygon>) {
    super();
    Object.assign(this, params);
    this.points = this.generatePoints();
    this.boundingBox = this.getBoundingBoxCoords();
  }

  private generatePoints(): Array<Vec2> {
    const angle = 360 / this.pointsCount;
    let points: Array<Vec2> = [];
    
    for (let i = 0; i < this.pointsCount; i++) {
      let point: Vec2 = {
        x: -Math.sin(radians(i * angle)) / 2,
        y: -Math.cos(radians(i * angle)) / 2
      };

      points.push(point);
    }

    return points;
  }

  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.fill;
    context.strokeStyle = this.borderColor;
    context.lineWidth = this.borderSize;

    this.path = new Path2D();

    const x = this.x + this.anchor.x * this.width;
    const y = this.y + this.anchor.y * this.height;
    const points = Transform.applyTransform(this.points as Array<Vec2>, x, y, this.width, this.height, this.rotation);
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