import { FILL_DEFAULT, BORDER_DEFAULT, STROKE_SIZE_DEFAULT } from "../constants/constants";
import { Drawable } from "./drawable";
import { Line } from "./line";

export class Text extends Drawable {
  fill: string = '#000000';
  borderColor: string = BORDER_DEFAULT;
  borderSize: number = STROKE_SIZE_DEFAULT;
  text: string = 'Lorem Ipsum';
  cursorPosition: number = 0;
  fontFamily: string = 'Poppins';
  fontSize: number = 12;
  fontAlign: string = 'left';

  private cursor!: Line;

  constructor(params: Partial<Text>) {
    super();
    Object.assign(this, params);

    this.cursor = new Line({
      x: this.x,
      y: this.y + 7,
      width: 0,
      height: this.fontSize,
      lineWidth: 3,
      rotation: 180
    });
  }

  public override draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = this.fill;
    context.strokeStyle = this.borderColor;
    context.lineWidth = this.borderSize;
    // console.log(this);
    
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.fillText(this.text, this.x, this.y);
    this.cursor.draw(context);
    context.restore();
  }
}