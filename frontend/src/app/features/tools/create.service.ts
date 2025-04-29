import { inject, Injectable } from '@angular/core';
import { Vec2 } from '../../engine/utils/math.utils';
import { ZoomAndPanDirective } from '../drawing-context/zoom-and-pan.directive';
import { ZoomAndPanService } from '../drawing-context/zoom-and-pan.service';
import { Tool } from './tool.model';
import { Drawable } from '../../engine/drawables/drawable';
import { SimpleRect } from '../../engine/drawables/simpleRectangle';
import { LayersService } from '../../shared/services/layers.service';
import { TOOL_TYPES } from '../../engine/constants/constants';
import { DrawableFactory } from '../../engine/drawables/drawableFactory';

@Injectable({
  providedIn: 'root'
})
export class CreateService {

  private start!: Vec2;
  private end!: Vec2;
  private zoomService = inject(ZoomAndPanService);
  private prevMouse!: Vec2;
  private layersService = inject(LayersService);
  
  boundingRect!: SimpleRect;
  isCreating: boolean = false;

  createInit(mouseX: number, mouseY: number) {
    const offset = this.zoomService.getOffset();
    const scale = this.zoomService.getScale();
    const mouse = {
      x: (mouseX - offset.x) / scale,
      y: (mouseY - offset.y) / scale 
    };
    this.start = mouse;
    this.prevMouse = mouse;
    this.isCreating = true;
    this.boundingRect = new SimpleRect({
      x: this.start.x,
      y: this.start.y,
      width: 0,
      height: 0,
      fill: 'transparent',
      borderSize: 2
    });
  }

  renderBoundingBox(mouseX: number, mouseY: number): void {
    if (this.isCreating) {
      const offset = this.zoomService.getOffset();
      const scale = this.zoomService.getScale();
      const mouse = {
        x: (mouseX - offset.x) / scale,
        y: (mouseY - offset.y) / scale 
      };

      const delta = {
        x: mouse.x - this.prevMouse.x,
        y: mouse.y - this.prevMouse.y
      }

      this.boundingRect.setSize(
        this.boundingRect.width + delta.x,
        this.boundingRect.height + delta.y
      );

      this.prevMouse = mouse;

      this.layersService.requestRedraw.next();
    }
  }

  createEnd(mouseX: number, mouseY: number, tool: Tool) {
    const offset = this.zoomService.getOffset();
    const scale = this.zoomService.getScale();
    const mouse = {
      x: (mouseX - offset.x) / scale,
      y: (mouseY - offset.y) / scale 
    };
    this.end = mouse;

    this.isCreating = false;
    if (this.start.x - this.end.x !== 0 && this.start.y - this.end.y !== 0) {
      this.createShapeBasedOnTool(tool);
      this.layersService.requestRedraw.next();
    }
  }

  private createShapeBasedOnTool(tool: Tool) {
    this.layersService.addedDrawable.next(DrawableFactory.createFromBox(
      tool.tool, this.start.x, this.start.y, this.end.x, this.end.y
    ) as Drawable);
  }
}
