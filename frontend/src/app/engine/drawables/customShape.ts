import { Transform, Vec2 } from "../utils/math.utils";
import { Shape } from "./shape";

export class PenPoint {
  center: Vec2;
  left: Vec2 | null;
  right: Vec2 | null;

  constructor(center: Vec2, right: Vec2 | null, left: Vec2 | null) {
    this.center = center;
    this.left = left;
    this.right = right;
  }

  public hasRight(): boolean {
    return this.right !== null;
  }

  public hasLeft(): boolean {
    return this.left !== null;
  }
}

export class CustomShape extends Shape {
  constructor(params: Partial<CustomShape>) {
    super();
    Object.assign(this, params);
  }

  public addPoint(c: Vec2, r: Vec2 | null, l: Vec2 | null) {
    this.points.push(new PenPoint(
      { x: c.x, y: c.y },
      r ? { x: r.x, y: r.y } : null,
      l ? { x: l.x, y: l.y } : null
    ));
  }

  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.fill;
    context.strokeStyle = this.borderColor;
    context.lineWidth = this.borderSize;

    console.log(this.points);

    for (let i = 0; i < this.points.length; i++) {
      this.points[i] = Transform.rotate(this.points[i], this.rotation);
    }

    this.path = new Path2D();
    
    const start = this.points[0];
    this.path.moveTo(start.center.x, start.center.y);

    for (let i = 1; i < this.points.length; i++) {
      const prev = this.points[i - 1];
      const current = this.points[i];

      if (!prev.hasRight() && !current.hasLeft()) {
        this.path.lineTo(
          current.center.x,
          current.center.y
        );
      } else if (prev.hasRight() && !current.hasLeft()) {
        this.path.quadraticCurveTo(
          prev.right?.x as number,
          prev.right?.y as number,
          current.center.x,
          current.center.y
        );
      } else if (!prev.hasRight() && current.hasLeft()) {
        this.path.quadraticCurveTo(
          current.left?.x as number,
          current.left?.y as number,
          current.center.x,
          current.center.y
        );
      } else if (prev.hasRight() && current.hasLeft()) {
        this.path.bezierCurveTo(
          prev.right?.x as number,
          prev.right?.y as number,
          current.left?.x as number,
          current.left?.y as number,
          current.center.x,
          current.center.y
        );
      }
    }

    context.fill(this.path);
    context.stroke(this.path);
    context.restore();
  }

  public closePath() {
    this.path.closePath();
  }
}