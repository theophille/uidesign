import { normalize, Transform, Vec2 } from "../utils/math.utils";
import { BoundingBox, Drawable } from "./drawable";
import { Ellipse } from "./ellipse";
import { Rectangle } from "./rectangle";
import { SimpleRect } from "./simpleRectangle";

export class TransformBox {
  x!: number;
  y!: number;
  width!: number;
  height!: number;
  rotation: number = 0;
  anchor!: Vec2;
  normals!: Array<Vec2>;
  selected!: Array<Drawable>;
  hidden: boolean = true;

  points!: Array<Vec2>;

  public rectangle: SimpleRect | null = null;
  public controls: Array<Ellipse> = [];

  private setNormals(): void {
    this.normals = [
      normalize({ x: -1, y: 1 }),
      normalize({ x: 0, y: 1 }),
      normalize({ x: 1, y: 1 }),
      normalize({ x: 1, y: 0 }),
      normalize({ x: 1, y: -1 }),
      normalize({ x: 0, y: -1 }),
      normalize({ x: -1, y: -1 }),
      normalize({ x: -1, y: 0 })
    ];
  }

  private setPoints(rotation: number): void {
    this.points = [
      { x: - this.anchor.x , y: 1 - this.anchor.y }, // top-left
      { x: 0.5 - this.anchor.x, y: 1 - this.anchor.y }, // top-center
      { x: 1 - this.anchor.x, y: 1 - this.anchor.y }, // top-right
      { x: 1 - this.anchor.x, y: 0.5 - this.anchor.y }, // right-center
      { x: 1 - this.anchor.x, y: 0 - this.anchor.y }, // bottom-right
      { x: 0.5 - this.anchor.x, y: 0 - this.anchor.y }, // bottom-center
      { x: 0 - this.anchor.x, y: 0 - this.anchor.y }, // bottom-left
      { x: 0 - this.anchor.x, y: 0.5 - this.anchor.y } // left-center
    ];

    this.rotation = rotation;

    this.points = Transform.applyTransform(
      this.points,
      this.x,
      this.y,
      this.width,
      this.height,
      this.rotation
    );
  }

  public setSelected(selection: Array<Drawable>, rotOccured?: boolean) {
    this.selected = selection;

    if (rotOccured || !this.normals) {
      this.setNormals();
    }

    this.set(rotOccured);
  }

  private set(rotOccured?: boolean): void {
    if (this.selected.length == 0) {
      this.hidden = true;
      this.rectangle = null;
      this.controls = [];
      return;
    }
    
    if (this.selected.length == 1) {
      this.hidden = false;
      const drawable = this.selected[0];
      this.width = drawable.width;
      this.height = drawable.height;
      this.x = drawable.x;
      this.y = drawable.y;
      this.rotation = drawable.rotation;
      this.anchor = drawable.anchor;
      this.setPoints(this.rotation);
    }

    if (this.selected.length > 1) {
      const boundingBox = this.getBundleBoundingBox(this.selected);
      this.width = boundingBox.maxX - boundingBox.minX;
      this.height = boundingBox.maxY - boundingBox.minY;
      this.x = Math.round(boundingBox.minX);
      this.y = Math.round(boundingBox.minY);
      this.anchor = {x: 0, y: 0};
      this.setPoints(0);
    }

    if (rotOccured) {
      this.normals = Transform.rotateAround(
        this.normals,
        { x: 0, y: 0 },
        this.rotation
      );
    }
  }
  
  public getBundleBoundingBox(selection: Array<Drawable>): BoundingBox {
    let boundingBox: BoundingBox = {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity
    }

    for (let i = 0; i < selection.length; i++) {
      const drawable: Drawable = selection[i];
      const dbb = drawable.boundingBox;
      
      if (boundingBox.minX > dbb.minX) {
        boundingBox.minX = dbb.minX;  
      }
      
      if (boundingBox.minY > dbb.minY) {
        boundingBox.minY = dbb.minY;
      }
      
      if (boundingBox.maxX < dbb.maxX) {
        boundingBox.maxX = dbb.maxX;
      }
      
      if (boundingBox.maxY < dbb.maxY) {
        boundingBox.maxY = dbb.maxY;
      }
    }

    return boundingBox;
  }

  public draw(context: CanvasRenderingContext2D, offset: Vec2, scale: number) {
    context.restore();

    this.rectangle = new SimpleRect({
      x: this.x * scale + offset.x,
      y: this.y * scale + offset.y,
      width: this.width * scale,
      height: this.height * scale,
      rotation: this.rotation,
      fill: 'transparent',
      borderSize: 2,
      anchor: { x: this.anchor.x, y: this.anchor.y }
    });

    this.controls = [];

    for (let i = 0; i < this.points.length; i++) {
      const ellipse = new Ellipse({
        x: this.points[i].x * scale + offset.x + this.anchor.x * this.width * scale - 5,
        y: this.points[i].y * scale + offset.y + this.anchor.y * this.height * scale - 5,
        width: 10,
        height: 10,
        rotation: 0,
        fill: 'white',
        borderSize: 1
      });
      this.controls.push(ellipse);
    }

    
    this.rectangle!.draw(context);
    
    for (let i = 0; i < this.controls.length; i++) {
      this.controls[i].draw(context);
    }

    context.save();
  }

  public isPointInside(context: CanvasRenderingContext2D, mx: number, my: number): boolean {
    if (this.rectangle) {
      return context.isPointInPath(this.rectangle.path, mx, my);
    }
    return false;
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.setPoints(this.rotation);
  }

  public getTopLeft(): Vec2 {
    const boundiingBox = this.getBundleBoundingBox(this.selected);
    return {
      x: boundiingBox.minX,
      y: boundiingBox.minY
    }
  }

  public setTransform(width: number, height: number, anchor: Vec2) {
    this.width = width;
    this.height = height;
    // this.anchor = anchor;

    // if (this.selected.length == 1) {
    //   const drawable = this.selected[0];
    //   drawable.width = width;
    //   drawable.height = height;
    //   drawable.boundingBox = this.rectangle!.getBoundingBoxCoords();
    //   drawable.anchor;
    //   drawable.x = drawable.boundingBox.minX;
    //   drawable.y = drawable.boundingBox.minY;
    // }
  }
}