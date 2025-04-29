import { BORDER_DEFAULT, FILL_DEFAULT, STROKE_SIZE_DEFAULT } from "../constants/constants";
import { Drawable } from "./drawable";

export abstract class Shape extends Drawable {
  fill: string = FILL_DEFAULT;
  borderColor: string = BORDER_DEFAULT;
  borderSize: number = STROKE_SIZE_DEFAULT;
}