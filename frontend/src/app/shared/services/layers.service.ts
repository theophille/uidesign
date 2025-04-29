import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BoundingBox, Drawable } from '../../engine/drawables/drawable';
import { DrawableFactory } from '../../engine/drawables/drawableFactory';
import { DRAWABLES, TOOL_TYPES } from '../../engine/constants/constants';
import { TransformBox } from '../../engine/drawables/transformBox';
import { Transform, Vec2 } from '../../engine/utils/math.utils';
import { ZoomAndPanService } from '../../features/drawing-context/zoom-and-pan.service';
import { Tool } from '../../features/tools/tool.model';
import { ToolsService } from '../../features/tools/tools.service';
import { CustomShape } from '../../engine/drawables/customShape';

export type Layers = Array<Drawable | Array<Drawable>>;

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  layers: WritableSignal<Array<Drawable>> = signal([
    // (DrawableFactory.createFromData(TOOL_TYPES.text, {
    //   x: 100, y: 100,
    //   width: 300, height: 300,
    //   rotation: 0,
    //   fontSize: 50
    // }) as Drawable),
    (DrawableFactory.createFromData(TOOL_TYPES.rectangle, {
      x: 1000, y: 300,
      width: 100, height: 100,
      rotation: 50, roundness: [0, 3, 0, 10]
    }, 'hehehehe') as Drawable),
    (DrawableFactory.createFromBox(TOOL_TYPES.rectangle, 100, 100, 200, 200) as Drawable),
    (DrawableFactory.createFromData(TOOL_TYPES.polygon, {
      x: 100, y: 100,
      width: 300, height: 700,
      rotation: 90, pointsCount: 6
    }) as Drawable),
    (DrawableFactory.createFromData(TOOL_TYPES.line, {
      x: 800, y: 200,
      width: 300, height: 300
    }) as Drawable),
    (DrawableFactory.createFromData(TOOL_TYPES.ellipse, {
      x: 1000, y: 300,
      width: 300, height: 500,
      fill: '#ff6590', rotation: 17
    }) as Drawable),
    
  ]);

  layersLoaded = new Subject<void>();
  layerClicked = new Subject<number | null>();
  selectedLayers: WritableSignal<Array<number>> = signal([]);
  requestRedraw = new Subject<void>();
  addedDrawable = new Subject<Drawable>();
  transformBox: TransformBox = new TransformBox();
  zoomService = inject(ZoomAndPanService);
  toolService = inject(ToolsService);
  selectedTool = new BehaviorSubject(
    this.toolService.getTools()[
    this.toolService.getActiveTool()()
  ]);

  // private custom: CustomShape {
  //   let cs = new CustomShape({});
  //   cs.addPoint(
  //     { x: 700, y: 700 },
  //     null, null
  //   );

  //   cs. add
  // }

  setTransformBox(): void {
    const selectedLayers = this.selectedLayers();
    const layers = this.layers();
    const selection = selectedLayers.map((i) => layers[i]);
    const scale = this.zoomService.getScale();
    const offset = this.zoomService.getOffset();
    this.transformBox.setSelected(selection);
  }

  public addDrawable(drawable: Drawable): void {
    this.layers.set([...this.layers(), drawable]);
  }
}
