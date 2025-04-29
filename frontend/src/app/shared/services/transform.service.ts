import { inject, Injectable } from '@angular/core';
import { LayersService } from './layers.service';
import { ZoomAndPanService } from '../../features/drawing-context/zoom-and-pan.service';
import { KeyboardService } from '../../core/services/keyboard.service';
import { KEYS } from '../../core/constants/constants';
import { Drawable } from '../../engine/drawables/drawable';
import { radians, Transform, Vec2 } from '../../engine/utils/math.utils';
import { TransformBox } from '../../engine/drawables/transformBox';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransformService {
  isDragging: boolean = false;
  isTransforming: boolean = false;
  dragOffset!: Vec2;
  overControl: number | null = null;
  controlPosition!: Vec2;
  transDirection!: Vec2;

  dragging = new Subject<void>();

  private layersService = inject(LayersService);
  private zoomAndPanService = inject(ZoomAndPanService);
  private keyboardService = inject(KeyboardService);

  private prevClick!: Vec2;
  private bounding!: Vec2;

  private clickInsideDrawable(mouse: Vec2, drawable: Drawable, context: CanvasRenderingContext2D): boolean {
    if (drawable.constructor.name.toLowerCase() !== 'text'){
      return (context?.isPointInPath(drawable.path, mouse.x, mouse.y) as boolean) ||
        (context?.isPointInStroke(drawable.path, mouse.x, mouse.y) as boolean);
    }

    return false;
  }

  onSelection(mouseX: number, mouseY: number, context: CanvasRenderingContext2D): void {
    const t = this.zoomAndPanService.getViewTransform();
    const mouse: Vec2 = {
      x: Math.round((mouseX - t.offset.x) / t.scale),
      y: Math.round((mouseY - t.offset.y) / t.scale)
    };
    
    const layers = this.layersService.layers();
    let clickedLayer = null;

    for (let i = 0; i < layers.length; i++) {
      if (layers[i] instanceof Drawable) {
        const drawable = (layers[i] as Drawable);
        if (this.clickInsideDrawable(mouse, drawable, context)) {
          clickedLayer = i;
          break;
        }
      }
    }

    if (!this.keyboardService.isPressed(KEYS.shift) &&
      !this.layersService.transformBox?.isPointInside(context as CanvasRenderingContext2D, mouseX, mouseY)) {
      
        this.layersService.layerClicked.next(null);
    }

    if (clickedLayer !== null) {
      this.layersService.layerClicked.next(clickedLayer);
    }
  }

  onHoverControlPoint(mouseX: number, mouseY: number, context: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const transformBox = this.layersService.transformBox;
    if (!transformBox) {
      return;
    }
    
    const controls = this.layersService.transformBox ? this.layersService.transformBox.controls : [];

    for (let i = 0; i < controls.length; i++) {
      if (context?.isPointInPath(controls[i].path, mouseX, mouseY)) {
        canvas.style.cursor = 'crosshair';
        this.overControl = i;
        return;
      }
    }

    this.overControl = null;
    canvas.style.cursor = 'default';
  }

  dragInit(mouseX: number, mouseY: number): void {
    const offset = this.zoomAndPanService.getOffset();
    const scale = this.zoomAndPanService.getScale();
    const mouse = {
      x: (mouseX - offset.x) / scale,
      y: (mouseY - offset.y) / scale
    };

    this.isDragging = true;

    this.prevClick = {
      x: mouse.x,
      y: mouse.y
    };
  }

  drag(mouseX: number, mouseY: number): void {
    const selectedLayers = this.layersService.selectedLayers();
    const layers = this.layersService.layers();
    const offset = this.zoomAndPanService.getOffset();
    const scale = this.zoomAndPanService.getScale();
    const mouse = {
      x: (mouseX - offset.x) / scale,
      y: (mouseY - offset.y) / scale
    };
    const delta = {
      x: mouse.x - this.prevClick.x,
      y: mouse.y - this.prevClick.y
    };

    for (let i = 0; i < selectedLayers.length; i++) {
      const drawable = layers[selectedLayers[i]];
      drawable.setTraslate(drawable.x + delta.x, drawable.y + delta.y);
    }

    this.dragging.next();
    this.layersService.setTransformBox();
    this.layersService.requestRedraw.next();

    this.prevClick = {
      x: mouse.x,
      y: mouse.y
    };
  }

  dragEnd() {
    this.isDragging = false;
  }

  transformInit(mouseX: number, mouseY: number): void {
    const box = this.layersService.transformBox as TransformBox;
    this.transDirection = box.normals[this.overControl as number];
    this.controlPosition = box.controls[this.overControl as number].getPosition();
    this.isTransforming = true;
    const offset = this.zoomAndPanService.getOffset();
    const scale = this.zoomAndPanService.getScale();
    this.prevClick = {
      x: (mouseX - offset.x) / scale,
      y: (mouseY - offset.y) / scale
    };
    this.bounding = box.getTopLeft();
  }
  
  transform(mouseX: number, mouseY: number): void {
    let box = this.layersService.transformBox as TransformBox;
    const selectedLayers = this.layersService.selectedLayers();
    const layers = this.layersService.layers();
    const offset = this.zoomAndPanService.getOffset();
    const scale = this.zoomAndPanService.getScale();
    const control = this.overControl as number;
    const dir = box.normals[control];
    
    const mouse = {
      x: (mouseX - offset.x) / scale,
      y: (mouseY - offset.y) / scale
    };

    let d = this.getDelta(mouse);
    let length = Math.sqrt(d.x * d.x + d.y * d.y);
    
    for (let i = 0; i < selectedLayers.length; i++) {
      const drawable = layers[selectedLayers[i]];

      if (control === 3) {
        const sign = d.x < 0 ? -1 : 1;
        drawable.setSize(drawable.width + d.x, drawable.height);
      }

      if (control === 7) {
        drawable.setSize(drawable.width - d.x, drawable.height);
      }

      if (control == 1) {
        drawable.setSize(drawable.width, drawable.height + d.y);
      }

      if (control === 5) {
        drawable.setSize(drawable.width, drawable.height - d.y);
      }
      
      if (control === 6) {
        drawable.setSize(drawable.width - d.x, drawable.height - d.y);
      }
      
      if (control === 4) {
        drawable.setSize(drawable.width + d.x, drawable.height - d.y);
      }
      
      if (control === 2) {
        drawable.setSize(drawable.width + d.x, drawable.height + d.y);
      }
      
      if (control === 0) {
        drawable.setSize(drawable.width - d.x, drawable.height + d.y);
      }

      // const angle = Math.acos(d.x / Math.sqrt(d.x * d.x + d.y * d.y));

      if (dir.x < 0) {
        drawable.x += d.x;
      }
      
      if (dir.y < 0) {
        drawable.y += d.y;
      }

      console.log(control);
      console.log('drawable', drawable.x, drawable.y);
      console.log('drawable.r', drawable.rotation);

      this.dragging.next();

      drawable.boundingBox = drawable.getBoundingBoxCoords();
    }

    this.prevClick = mouse;
    this.layersService.setTransformBox();
    this.layersService.requestRedraw.next();

  }

  endTransform(): void {
    this.overControl = null;
    this.isTransforming = false;
  }

  private getDelta(mouse: Vec2): Vec2 {
    const box = this.layersService.transformBox as TransformBox;
    const control = this.overControl as number;
    const dir = box.normals[control];
    const offset = this.zoomAndPanService.getOffset();
    const scale = this.zoomAndPanService.getScale();

    let point, mouseDelta: Vec2, t;

    point = {
      x: (box.controls[control].x - offset.x) / scale,
      y: (box.controls[control].y - offset.y) / scale
    };

    mouseDelta = {
      x: mouse.x - point.x,
      y: mouse.y - point.y
    };

    t = mouseDelta.x * dir.x + mouseDelta.y * dir.y;

    let d = {
      x: t * dir.x,
      y: t * dir.y
    };

    return d;
  }
}
