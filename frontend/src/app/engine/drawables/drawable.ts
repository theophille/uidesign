import { Transform, Vec2 } from "../utils/math.utils";

export interface BoundingBox {
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
}

export abstract class Drawable {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  rotation: number = 0;
  boundingBox!: BoundingBox;
  label!: string;
  path!: Path2D;
  anchor: Vec2 = { x: 0.5, y: 0.5 };

  protected points!: any;

  public setTraslate(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.boundingBox = this.getBoundingBoxCoords();
  }
  
  public setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
  
  public setRotation(deg: number): void {
    this.rotation = deg;
    this.boundingBox = this.getBoundingBoxCoords();
  }

  public getPosition(): Vec2 {
    return {
      x: this.x,
      y: this.y
    };
  }


  public getUnitBoundingBox(): Array<Vec2> {
    const anchorPercent = {
      x: this.anchor.x / this.width,
      y: this.anchor.y / this.height
    };

    return [
      { x: - this.anchor.x, y: - this.anchor.y },
      { x: 1 - this.anchor.x, y: - this.anchor.y },
      { x: 1 - this.anchor.x, y: 1 - this.anchor.y },
      { x: - this.anchor.x, y: 1 - this.anchor.y },
    ];
  }

  public getBoundingBoxCoords(rotation?: number): BoundingBox {
    let unitBoundingBox = this.getUnitBoundingBox();

    let p;
    if (rotation !== undefined) {
      p = Transform.applyTransform(unitBoundingBox, this.x + this.anchor.x * this.width, this.y + this.anchor.y * this.height, this.width, this.height, rotation);
    } else {
      p = Transform.applyTransform(unitBoundingBox, this.x + this.anchor.x * this.width, this.y + this.anchor.y * this.height, this.width, this.height, this.rotation);      
    }

    
    
    let boundingBox = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    }

    for (let i = 0; i < p.length; i++) {
      if (boundingBox.minX > p[i].x) {
        boundingBox.minX = p[i].x;
      }
      
      if (boundingBox.minY > p[i].y) {
        boundingBox.minY = p[i].y;
      }
      
      if (boundingBox.maxX < p[i].x) {
        boundingBox.maxX = p[i].x;
      }
      
      if (boundingBox.maxY < p[i].y) {
        boundingBox.maxY = p[i].y;
      }
    }
    
    return boundingBox;
  }

  public abstract draw(context: CanvasRenderingContext2D): void;
}